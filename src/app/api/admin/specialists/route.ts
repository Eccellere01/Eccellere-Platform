import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAdmin(role?: string | null) {
  return (
    role === "ADMIN" ||
    role === "SUPER_ADMIN" ||
    role === "CRM_ADMIN" ||
    role === "SPECIALIST_ADMIN"
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let specialists;
  try {
    specialists = await Promise.race([
      prisma.specialistProfile.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          headline: true,
          currentRole: true,
          organisation: true,
          serviceDomains: true,
          sectorExpertise: true,
          status: true,
          averageRating: true,
          totalAssignments: true,
          totalEarnings: true,
          createdAt: true,
          user: {
            select: { name: true, email: true },
          },
          publishedAssets: {
            select: { id: true },
          },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB timeout")), 5000)
      ),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/specialists] DB error:", message);
    return NextResponse.json(
      { error: "Service temporarily unavailable", detail: message },
      { status: 503 }
    );
  }

  const mapped = specialists.map((s) => {
    const domains = Array.isArray(s.serviceDomains) ? s.serviceDomains as string[] : [];
    const sectors = Array.isArray(s.sectorExpertise) ? s.sectorExpertise as string[] : [];

    const statusMap: Record<string, string> = {
      APPLIED: "pending",
      UNDER_REVIEW: "pending",
      REVISIONS_REQUESTED: "pending",
      APPROVED: "active",
      ACTIVE: "active",
      SUSPENDED: "inactive",
    };

    return {
      id: s.id,
      name: s.user.name || s.user.email,
      email: s.user.email,
      expertise: domains.slice(0, 3).join(", ") || s.headline || s.currentRole || "—",
      sectors: sectors.slice(0, 3),
      status: statusMap[s.status] ?? "pending",
      rawStatus: s.status,
      assets: s.publishedAssets.length,
      rating: s.averageRating && s.averageRating > 0 ? s.averageRating : null,
      earnings: s.totalEarnings > 0
        ? `₹${s.totalEarnings.toLocaleString("en-IN")}`
        : "₹0",
      joined: new Date(s.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    };
  });

  return NextResponse.json({ specialists: mapped });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
  }

  const statusUpdate =
    action === "approve"
      ? "APPROVED"
      : action === "reject"
      ? "REVISIONS_REQUESTED"
      : null;

  if (!statusUpdate) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    await prisma.specialistProfile.update({
      where: { id },
      data: { status: statusUpdate as never },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
