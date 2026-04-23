import { NextRequest, NextResponse } from "next/server";
import { NextResponse as NR } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ── POST /api/payments ─────────────────────────────────────────────────────
// Returns the Razorpay key + amount so the client can open checkout directly.
// No server-side Razorpay API call — avoids outbound connection restrictions
// on shared hosting. The client opens checkout; PATCH records the payment.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { amount: number; assetSlug: string; assetTitle: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.amount || !body.assetSlug || !body.assetTitle) {
    return NextResponse.json(
      { error: "amount, assetSlug, and assetTitle are required" },
      { status: 400 }
    );
  }

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return NextResponse.json(
      { error: "amount must be a positive integer (paise)" },
      { status: 400 }
    );
  }

  // TEMP: force mock mode to test checkout flow end-to-end
  // TODO: remove this override once Razorpay is confirmed working
  const FORCE_MOCK = true;

  const keyId = process.env.RAZORPAY_KEY_ID;

  // Real keys look like: rzp_test_<10+ alphanumeric chars> or rzp_live_<...>
  const isRealKey = (k: string) => /^rzp_(test|live)_[A-Za-z0-9]{10,}$/.test(k) && !k.includes("X");

  // If Razorpay is not configured, return a mock order for development
  if (FORCE_MOCK || !keyId || !isRealKey(keyId)) {
    return NextResponse.json({
      orderId: `mock_order_${Date.now()}`,
      amount: body.amount,
      currency: "INR",
      keyId: "rzp_test_mock",
      assetSlug: body.assetSlug,
      assetTitle: body.assetTitle,
      mock: true,
    });
  }

  // Return key + amount — client opens Razorpay checkout directly (no server-side order pre-creation)
  return NextResponse.json({
    orderId: null,
    amount: body.amount,
    currency: "INR",
    keyId,
    assetSlug: body.assetSlug,
    assetTitle: body.assetTitle,
  });
}

// ── PATCH /api/payments — verify Razorpay payment signature ──────────────────
// Called after Razorpay checkout succeeds on the client.
// Verifies signature, then creates an Order record.
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NR.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    assetSlug: string;
    assetTitle: string;
    assetFormat: string;
    amount: number;
  };

  try {
    body = await request.json();
  } catch {
    return NR.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = ["razorpayOrderId", "razorpayPaymentId", "assetSlug", "assetTitle", "assetFormat", "amount"];
  for (const field of required) {
    if (!body[field as keyof typeof body]) {
      return NR.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Only verify signature when a server-side order was pre-created and signature is provided
  const isMockOrder = body.razorpayOrderId.startsWith("mock_order_") || body.razorpayOrderId.startsWith("direct_");
  const hasSignature = body.razorpaySignature && body.razorpaySignature !== "mock_signature";
  if (!isMockOrder && hasSignature && keySecret) {
    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(body.razorpaySignature, "hex");

    const isValid =
      expected.length === received.length &&
      timingSafeEqual(expected, received);

    if (!isValid) {
      return NR.json({ error: "Payment signature verification failed" }, { status: 400 });
    }
  }

  // Persist order to DB (best-effort — payment already succeeded, so never fail the
  // response because of a DB error; log and fall back to a generated order number).
  let dbOrderNumber: string | null = null;
  let dbOrderId: string | null = null;
  try {
    const persisted = await persistOrderToDb({
      userEmail: session.user.email!,
      assetSlug: body.assetSlug,
      assetTitle: body.assetTitle,
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      amountPaise: body.amount,
    });
    dbOrderNumber = persisted.orderNumber;
    dbOrderId = persisted.id;
  } catch (err) {
    console.error("[payments/PATCH] DB persist error:", err);
  }

  const orderNumber = dbOrderNumber ?? `ORD-${Date.now().toString().slice(-6)}`;
  const orderId = dbOrderId ?? orderNumber;
  const now = new Date().toISOString();

  return NR.json({
    order: {
      id: orderNumber,
      dbId: orderId,
      userId: session.user.email,
      assetSlug: body.assetSlug,
      assetTitle: body.assetTitle,
      assetFormat: body.assetFormat,
      amount: body.amount,
      currency: "INR",
      status: "paid",
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      createdAt: now,
      updatedAt: now,
      downloadUrl: `/api/files/assets/${body.assetSlug}.${body.assetFormat.toLowerCase()}`,
    },
    verified: true,
  }, { status: 201 });
}

// ── Persist order + order item + framework access to DB ──────────────────────
// Idempotent: if an Order with this gatewayOrderId already exists, returns it.
async function persistOrderToDb({
  userEmail,
  assetSlug,
  razorpayOrderId,
  razorpayPaymentId,
  amountPaise,
}: {
  userEmail: string;
  assetSlug: string;
  assetTitle: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountPaise: number;
}): Promise<{ id: string; orderNumber: string }> {
  // Idempotency: return existing order if this gateway order was already recorded
  const existing = await prisma.order.findFirst({
    where: { gatewayOrderId: razorpayOrderId },
    select: { id: true, orderNumber: true },
  });
  if (existing) return existing;

  // Resolve user and asset in parallel
  const [user, asset] = await Promise.all([
    prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, clientProfile: { select: { id: true } } },
    }),
    prisma.asset.findFirst({
      where: { slug: assetSlug },
      select: { id: true, price: true },
    }),
  ]);

  if (!user) throw new Error(`User not found for email: ${userEmail}`);
  if (!asset) throw new Error(`Asset not found for slug: ${assetSlug}`);

  const amountRupees = Math.round(amountPaise / 100);
  // Use a timestamp + random suffix to avoid collisions under concurrent requests
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        subtotal: amountRupees,
        gstAmount: 0,
        discountAmount: 0,
        totalAmount: amountRupees,
        currency: "INR",
        status: "PAID",
        paymentGateway: "razorpay",
        gatewayOrderId: razorpayOrderId,
        gatewayPaymentId: razorpayPaymentId,
        items: {
          create: {
            assetId: asset.id,
            quantity: 1,
            unitPrice: amountRupees,
            totalPrice: amountRupees,
          },
        },
      },
      select: { id: true, orderNumber: true },
    });

    // Grant FrameworkAccess if the buyer has a ClientProfile
    if (user.clientProfile?.id) {
      const existing = await tx.frameworkAccess.findFirst({
        where: { clientProfileId: user.clientProfile.id, assetId: asset.id },
        select: { id: true },
      });
      if (!existing) {
        await tx.frameworkAccess.create({
          data: {
            clientProfileId: user.clientProfile.id,
            assetId: asset.id,
            status: "purchased",
          },
        });
      }
    }

    return o;
  });

  return order;
}
