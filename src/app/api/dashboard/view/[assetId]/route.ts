import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { resolveUploadPath } from "@/lib/uploads";
import { createRequire } from "module";

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

    // ── DOCX / DOC → convert to HTML for inline browser viewing ──────────────
    if (ext === ".docx" || ext === ".doc") {
      const require = createRequire(import.meta.url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mammoth = require("mammoth") as any;
      const buffer = fs.readFileSync(absPath);
      // Mammoth styleMap maps Word styles to semantic HTML so CSS can target them.
      // Default behaviour drops most paragraph/character styles; this preserves them.
      const styleMap = [
        "p[style-name='Title'] => h1.title:fresh",
        "p[style-name='Subtitle'] => p.subtitle:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Quote'] => blockquote:fresh > p:fresh",
        "p[style-name='Intense Quote'] => blockquote.intense:fresh > p:fresh",
        "p[style-name='List Paragraph'] => li:fresh",
        "p[style-name='Caption'] => p.caption:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        "r[style-name='Intense Emphasis'] => em.intense",
        "r[style-name='Code'] => code",
        "b => strong",
        "i => em",
        "u => u",
      ].join("\n");
      const result = await mammoth.convertToHtml(
        { buffer },
        {
          styleMap,
          includeDefaultStyleMap: true,
          ignoreEmptyParagraphs: false,
        }
      );
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${asset.title.replace(/</g, "&lt;")}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Calibri', 'Segoe UI', system-ui, -apple-system, sans-serif;
      max-width: 860px;
      margin: 40px auto;
      padding: 56px 72px 96px;
      color: #1a1a1a;
      line-height: 1.55;
      font-size: 15px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04);
      border: 1px solid #eee;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Calibri Light', 'Segoe UI', system-ui, sans-serif;
      color: #2e2e2e;
      font-weight: 600;
      line-height: 1.25;
      margin: 1.6em 0 0.5em;
    }
    h1.title { font-size: 2.2em; font-weight: 300; color: #1f3864; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 0; }
    p.subtitle { font-size: 1.15em; color: #555; font-style: italic; margin-top: -0.4em; }
    h1 { font-size: 1.75em; color: #1f3864; }
    h2 { font-size: 1.4em; color: #2e74b5; border-bottom: 1px solid #f0f0f0; padding-bottom: 0.2em; }
    h3 { font-size: 1.2em; color: #2e74b5; }
    h4 { font-size: 1.05em; color: #2e74b5; font-style: italic; }
    h5, h6 { font-size: 1em; color: #404040; }
    p { margin: 0.6em 0; }
    a { color: #0563c1; text-decoration: underline; }
    strong, b { font-weight: 700; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    ul, ol { margin: 0.5em 0 0.8em; padding-left: 1.8em; }
    ul ul, ol ol, ul ol, ol ul { margin: 0.2em 0; }
    li { margin: 0.25em 0; }
    li > p { margin: 0; }
    blockquote {
      margin: 1em 0;
      padding: 0.6em 1.2em;
      border-left: 4px solid #2e74b5;
      background: #f5f9fc;
      color: #404040;
      font-style: italic;
    }
    blockquote.intense { border-left-color: #1f3864; background: #eaf1f8; font-weight: 500; }
    code { font-family: 'Consolas', 'Courier New', monospace; background: #f4f4f5; padding: 1px 5px; border-radius: 3px; font-size: 0.92em; }
    pre { background: #f4f4f5; padding: 12px; border-radius: 4px; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.95em; }
    td, th { border: 1px solid #cfcfcf; padding: 8px 12px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; font-weight: 600; }
    tr:nth-child(even) td { background: #fafafa; }
    img { max-width: 100%; height: auto; margin: 0.6em 0; }
    p.caption { font-size: 0.88em; color: #666; font-style: italic; text-align: center; margin-top: 0.2em; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2em 0; }
    @media (max-width: 720px) {
      body { margin: 0; padding: 24px 18px 48px; box-shadow: none; border: none; }
    }
    @media print {
      body { box-shadow: none; border: none; margin: 0; max-width: none; padding: 0.6in; }
    }
  </style>
</head>
<body>
${result.value}
</body>
</html>`;
      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store",
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
