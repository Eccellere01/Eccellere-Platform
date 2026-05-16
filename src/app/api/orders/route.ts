import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";

// API response shape consumed by future /account/orders UI (kept stable).
export type OrderDTO = {
  id: string;
  orderNumber: string;
  userId: string;
  assetSlug: string;
  assetTitle: string;
  assetFormat: string;
  amount: number; // in paise — full order total
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
  licenceType: string;
  items: Array<{
    assetSlug: string;
    assetTitle: string;
    assetFormat: string;
    unitPrice: number;
    quantity: number;
    downloadUrl?: string;
  }>;
};

// Map DB enum → public API status (lowercase) for stable client contract.
function mapStatus(s: OrderStatus): OrderDTO["status"] {
  switch (s) {
    case "PAID":
      return "paid";
    case "FAILED":
    case "CANCELLED":
      return "failed";
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
    case "REFUND_REQUESTED":
      return "refunded";
    default:
      return "pending";
  }
}

// Accept lowercase ?status= query param, return DB enum or null if unknown.
function parseStatusFilter(s: string | null): OrderStatus | null {
  if (!s) return null;
  switch (s.toLowerCase()) {
    case "paid":
      return "PAID";
    case "pending":
      return "PENDING";
    case "failed":
      return "FAILED";
    case "refunded":
      return "REFUNDED";
    default:
      return null;
  }
}

function inferFormat(asset: { fileUrls?: unknown }): string {
  // Best-effort: pick first file extension from fileUrls JSON, else fallback.
  const files = asset.fileUrls;
  if (Array.isArray(files) && files.length > 0 && typeof files[0] === "string") {
    const ext = files[0].split(".").pop();
    if (ext && ext.length <= 5) return ext.toUpperCase();
  }
  if (files && typeof files === "object") {
    const values = Object.values(files as Record<string, unknown>);
    for (const v of values) {
      if (typeof v === "string") {
        const ext = v.split(".").pop();
        if (ext && ext.length <= 5) return ext.toUpperCase();
      }
    }
  }
  return "PDF";
}

// ── GET /api/orders — list orders for the authenticated user ─────────────────
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = parseStatusFilter(searchParams.get("status"));
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "20", 10) || 20, 1), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ orders: [], total: 0, limit, offset });
  }

  const where = {
    userId: user.id,
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        items: {
          include: {
            asset: {
              select: { slug: true, title: true, fileUrls: true, licenceType: true },
            },
          },
        },
      },
    }),
  ]);

  const orders: OrderDTO[] = rows.map((o) => {
    const first = o.items[0];
    const firstAsset = first?.asset;
    const firstFormat = firstAsset ? inferFormat(firstAsset) : "PDF";
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      userId: o.userId,
      assetSlug: firstAsset?.slug ?? "",
      assetTitle: firstAsset?.title ?? "Order",
      assetFormat: firstFormat,
      amount: o.totalAmount,
      currency: o.currency,
      status: mapStatus(o.status),
      razorpayOrderId: o.gatewayOrderId ?? undefined,
      razorpayPaymentId: o.gatewayPaymentId ?? undefined,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      downloadUrl: firstAsset?.slug
        ? `/api/files/assets/${firstAsset.slug}.${firstFormat.toLowerCase()}`
        : undefined,
      licenceType: firstAsset?.licenceType ?? "single-use",
      items: o.items.map((it) => ({
        assetSlug: it.asset?.slug ?? "",
        assetTitle: it.asset?.title ?? "",
        assetFormat: it.asset ? inferFormat(it.asset) : "PDF",
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        downloadUrl: it.asset?.slug
          ? `/api/files/assets/${it.asset.slug}.${inferFormat(it.asset).toLowerCase()}`
          : undefined,
      })),
    };
  });

  return NextResponse.json({ orders, total, limit, offset });
}

// ── POST /api/orders ─────────────────────────────────────────────────────────
// Order rows are now created server-side by the Razorpay webhook
// (`/api/webhooks/razorpay`) and by the payment-verification flow in
// `/api/payments` (PATCH → persistOrderToDb). This endpoint is retained
// only to avoid breaking older clients and returns 410 Gone.
export async function POST() {
  return NextResponse.json(
    {
      error: "Orders are created automatically after payment verification. Use /api/payments instead.",
    },
    { status: 410 }
  );
}
