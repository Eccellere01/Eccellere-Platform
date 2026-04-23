import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/specialist/stats — specialist dashboard KPIs, recent assets, active assignments
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await Promise.race([
      prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          specialistProfile: {
            select: {
              id: true,
              totalEarnings: true,
              averageRating: true,
              revenueSharePct: true,
              publishedAssets: {
                select: {
                  id: true,
                  title: true,
                  status: true,
                  price: true,
                  components: true,
                  fileUrls: true,
                  totalPurchases: true,
                  totalRevenue: true,
                  totalViews: true,
                  averageRating: true,
                  updatedAt: true,
                },
                orderBy: { updatedAt: "desc" },
                take: 5,
              },
              assignments: {
                where: {
                  status: { in: ["IN_PROGRESS", "ACCEPTED", "MATCHED"] },
                },
                select: {
                  id: true,
                  title: true,
                  dueDate: true,
                  agreedFee: true,
                  status: true,
                  client: {
                    select: { user: { select: { name: true } } },
                  },
                },
                orderBy: { dueDate: "asc" },
                take: 5,
              },
            },
          },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB timeout")), 8000)
      ),
    ]);

    if (!user?.specialistProfile) {
      return NextResponse.json({ error: "Specialist profile not found" }, { status: 404 });
    }

    const sp = user.specialistProfile;

    const publishedCount = sp.publishedAssets.filter(
      (a) => a.status === "PUBLISHED" || a.status === "APPROVED"
    ).length;

    const activeAssignmentsCount = sp.assignments.length;

    return NextResponse.json({
      name: user.name,
      kpis: {
        totalEarnings: sp.totalEarnings,
        publishedAssets: publishedCount,
        activeAssignments: activeAssignmentsCount,
        avgRating: sp.averageRating ?? 0,
      },
      recentAssets: sp.publishedAssets.map((a) => ({
        id: a.id,
        title: a.title,
        status: a.status,
        price: a.price,
        components: a.components,
        hasFile: Array.isArray(a.fileUrls) && (a.fileUrls as string[]).length > 0,
        totalPurchases: a.totalPurchases,
        totalRevenue: a.totalRevenue,
        totalViews: a.totalViews,
        averageRating: a.averageRating,
      })),
      activeAssignments: sp.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        clientName: a.client.user.name,
        dueDate: a.dueDate,
        agreedFee: a.agreedFee,
        status: a.status,
      })),
    });
  } catch (err) {
    console.error("[specialist/stats]", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
