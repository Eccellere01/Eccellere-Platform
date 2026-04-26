import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { resolveUploadPath } from "@/lib/uploads";
import { signAssetToken } from "@/lib/asset-token";

export const dynamic = "force-dynamic";

// GET /api/dashboard/view/[assetId]
// Streams the purchased asset file for inline browser viewing (not forced download).
// Identical auth logic to download route; differs only in Content-Disposition header.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assetId } = await params;

  const dbTimeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("DB timeout")), 8000)
  );

  let user: { id: string; orders: { id: string }[] } | null;
  let asset: { title: string; fileUrls: unknown } | null;

  try {
    [user, asset] = await Promise.race([
      Promise.all([
        prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            orders: {
              where: { status: "PAID", items: { some: { assetId } } },
              select: { id: true },
              take: 1,
            },
          },
        }),
        prisma.asset.findUnique({
          where: { id: assetId },
          select: { title: true, fileUrls: true },
        }),
      ]),
      dbTimeout,
    ]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.orders.length === 0) {
    return NextResponse.json({ error: "You have not purchased this asset" }, { status: 403 });
  }
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const fileUrls = Array.isArray(asset.fileUrls) ? (asset.fileUrls as string[]) : [];
  const fileUrl = fileUrls[0] ?? null;

  if (!fileUrl) {
    return NextResponse.json(
      { error: "No file is attached to this asset yet. Please contact support." },
      { status: 404 }
    );
  }

  // ── Files stored in uploads dir (local / Hostinger persistent disk) ───────
  if (fileUrl.startsWith("/uploads/")) {
    let absPath: string;
    try {
      absPath = resolveUploadPath(fileUrl);
    } catch {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    if (!fs.existsSync(absPath)) {
      return NextResponse.json(
        { error: "File not found on server. Please contact support." },
        { status: 404 }
      );
    }

    const ext = path.extname(absPath).toLowerCase();

    // ── DOCX → client-side render with docx-preview (loaded from CDN) ───────
    // Office Online and Google Docs both block iframe embedding via
    // X-Frame-Options. docx-preview runs entirely in the browser, downloads
    // the file from our authenticated /api/files/asset/<token> endpoint, and
    // renders it preserving fonts/tables/images/colors.
    if (ext === ".docx") {
      const token = signAssetToken(assetId, user.id);
      const fileUrl = `/api/files/asset/${token}`;
      const safeTitle = asset.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    html, body { margin: 0; padding: 0; min-height: 100vh; background: #f3f4f6; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a1a; }
    .topbar { background: #1f3864; color: #fff; padding: 10px 20px; font-size: 14px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }
    .topbar h1 { margin: 0; font-size: 15px; font-weight: 500; }
    .topbar a { color: #c7d2e0; text-decoration: none; font-size: 13px; }
    .topbar a:hover { color: #fff; text-decoration: underline; }
    #viewer { max-width: 1000px; margin: 24px auto; padding: 0 16px 60px; }
    #viewer .docx-wrapper { background: transparent !important; padding: 0 !important; }
    #viewer .docx-wrapper > section.docx { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04); margin-bottom: 16px; background: #fff !important; }
    #status { text-align: center; padding: 80px 20px; color: #6b7280; font-size: 15px; }
    #status .spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #1f3864; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-box { max-width: 540px; margin: 80px auto; padding: 24px; background: #fff; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b; }
    .error-box h2 { margin-top: 0; color: #991b1b; }
    .error-box a { color: #0563c1; }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>${safeTitle}</h1>
    <a href="javascript:window.print()">Print</a>
  </div>
  <div id="status"><div class="spinner"></div><div>Loading document…</div></div>
  <div id="viewer"></div>
  <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docx-preview@0.3.6/dist/docx-preview.min.js"></script>
  <script>
    (async function () {
      var status = document.getElementById('status');
      var viewer = document.getElementById('viewer');
      try {
        var resp = await fetch(${JSON.stringify(fileUrl)}, { credentials: 'same-origin' });
        if (!resp.ok) throw new Error('Failed to fetch file: HTTP ' + resp.status);
        var blob = await resp.blob();
        if (typeof window.docx === 'undefined' || !window.docx.renderAsync) {
          throw new Error('Viewer library failed to load');
        }
        await window.docx.renderAsync(blob, viewer, null, {
          className: 'docx',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
          trimXmlDeclaration: true,
          useBase64URL: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true
        });
        status.style.display = 'none';
      } catch (err) {
        status.innerHTML = '<div class="error-box"><h2>Could not load document</h2><p>' + (err && err.message ? err.message : 'Unknown error') + '</p><p><a href="/api/dashboard/download/' + ${JSON.stringify(assetId)} + '">Try downloading the file</a> if download is enabled for your purchase.</p></div>';
      }
    })();
  </script>
  <noscript>
    <div class="error-box">
      <h2>${safeTitle}</h2>
      <p>JavaScript is required to view this document inline. You can still <a href="/api/dashboard/download/${assetId}">download the file</a> if downloading is enabled for your purchase.</p>
    </div>
  </noscript>
</body>
</html>`;
      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store",
          // Allow loading docx-preview + jszip from jsDelivr CDN.
          "Content-Security-Policy":
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: blob: https:; " +
            "font-src 'self' data: https:; " +
            "connect-src 'self'; " +
            "frame-ancestors 'self';",
        },
      });
    }

    // ── PDF → serve inline (browsers render natively) ────────────────────────
    const stat = fs.statSync(absPath);
    const contentTypeMap: Record<string, string> = {
      ".pdf":  "application/pdf",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xls":  "application/vnd.ms-excel",
      ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".ppt":  "application/vnd.ms-powerpoint",
      ".zip":  "application/zip",
    };
    const contentType = contentTypeMap[ext] ?? "application/octet-stream";

    const safeTitle = asset.title.replace(/[^\w\s.-]/g, "").trim().replace(/\s+/g, "_");
    const filename = `${safeTitle}${ext}`;

    const nodeStream = fs.createReadStream(absPath);
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) =>
          controller.enqueue(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
        );
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (e) => controller.error(e));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // ── External URLs (S3 / CDN) — redirect ────────────────────────────────────
  return NextResponse.redirect(fileUrl);
}
