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

  let orders;
  try {
    orders = await Promise.race([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          currency: true,
          status: true,
          paymentGateway: true,
          paymentMethod: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              clientProfile: {
                select: { companyName: true },
              },
            },
          },
          items: {
            take: 1,
            select: {
              asset: {
                select: { title: true },
              },
            },
          },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB timeout")), 5000)
      ),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/orders] DB error:", message);
    return NextResponse.json(
      { error: "Service temporarily unavailable", detail: message },
      { status: 503 }
    );
  }

  const mapped = orders.map((o) => {
    const clientName =
      o.user.clientProfile?.companyName || o.user.name || o.user.email;
    const assetTitle = o.items[0]?.asset?.title ?? "—";
    const payment = o.paymentGateway
      ? o.paymentGateway.charAt(0).toUpperCase() +
        o.paymentGateway.slice(1).toLowerCase()
      : o.paymentMethod ?? "—";

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      client: clientName,
      email: o.user.email,
      asset: assetTitle,
      amount: `₹${Math.floor(o.totalAmount / 100).toLocaleString("en-IN")}`,
      status: o.status.toLowerCase(),
      payment,
      date: new Date(o.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  });

  return NextResponse.json({ orders: mapped });
}

// ── PATCH /api/admin/orders — update order status ────────────────────────────
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id: string; status: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validStatuses = ["PENDING", "PAID", "FAILED", "REFUND_REQUESTED", "REFUNDED", "PARTIALLY_REFUNDED", "CANCELLED"];
  const statusUpper = body.status?.toUpperCase();
  if (!body.id || !validStatuses.includes(statusUpper)) {
    return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
  }

  try {
    const updated = await prisma.order.update({
      where: { id: body.id },
      data: { status: statusUpper as never, updatedAt: new Date() },
      select: { id: true, status: true },
    });
    return NextResponse.json({ order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/orders PATCH] error:", message);
    return NextResponse.json({ error: "Update failed", detail: message }, { status: 500 });
  }
}

// ── DELETE /api/admin/orders?id=xxx — delete an order ────────────────────────
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/orders DELETE] error:", message);
    return NextResponse.json({ error: "Delete failed", detail: message }, { status: 500 });
  }
}
