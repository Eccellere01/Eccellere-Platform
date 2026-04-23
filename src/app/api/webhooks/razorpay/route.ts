import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

// Razorpay sends a POST to this endpoint with payment events.
// We verify the webhook signature using RAZORPAY_WEBHOOK_SECRET.
// Reference: https://razorpay.com/docs/webhooks/

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    // Webhook secret not configured — log and accept in dev
    if (process.env.NODE_ENV !== "production") {
      const body = await request.json();
      console.log("[webhook/razorpay] (no secret, dev mode) event:", body?.event);
      return NextResponse.json({ received: true });
    }
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await request.text();

  // Verify webhook signature
  const expectedHmac = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedHmac, "hex");
  const received = Buffer.from(signature, "hex");

  const isValid =
    expected.length === received.length &&
    timingSafeEqual(expected, received);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: { event: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Handle payment events
  switch (event.event) {
    case "payment.captured": {
      const payment = (event.payload as { payment?: { entity?: Record<string, unknown> } })
        ?.payment?.entity;
      if (payment) {
        const notes = payment.notes as Record<string, string> | undefined;
        const razorpayOrderId = String(payment.order_id ?? "");
        const razorpayPaymentId = String(payment.id ?? "");
        const amountPaise = Number(payment.amount ?? 0);
        const customerEmail = notes?.customerEmail ?? "";
        const assetSlug = notes?.assetSlug ?? "";

        console.log("[webhook/razorpay] payment.captured", {
          paymentId: razorpayPaymentId,
          orderId: razorpayOrderId,
          amount: amountPaise,
          customerEmail,
          assetSlug,
        });

        // Persist order as fallback (idempotent — PATCH handler may have already done this)
        if (customerEmail && assetSlug && razorpayOrderId) {
          try {
            // Idempotency check first to avoid duplicate inserts
            const existing = await prisma.order.findFirst({
              where: { gatewayOrderId: razorpayOrderId },
              select: { id: true },
            });
            if (!existing) {
              const [user, asset] = await Promise.all([
                prisma.user.findUnique({
                  where: { email: customerEmail },
                  select: { id: true, clientProfile: { select: { id: true } } },
                }),
                prisma.asset.findFirst({
                  where: { slug: assetSlug },
                  select: { id: true },
                }),
              ]);

              if (user && asset) {
                const amountRupees = Math.round(amountPaise / 100);
                const orderNumber = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;

                await prisma.$transaction(async (tx) => {
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
                        create: { assetId: asset.id, quantity: 1, unitPrice: amountRupees, totalPrice: amountRupees },
                      },
                    },
                    select: { id: true },
                  });

                  if (user.clientProfile?.id) {
                    const fa = await tx.frameworkAccess.findFirst({
                      where: { clientProfileId: user.clientProfile.id, assetId: asset.id },
                      select: { id: true },
                    });
                    if (!fa) {
                      await tx.frameworkAccess.create({
                        data: { clientProfileId: user.clientProfile.id, assetId: asset.id, status: "purchased" },
                      });
                    }
                  }
                  return o;
                });
                console.log("[webhook/razorpay] order persisted via webhook fallback:", orderNumber);
              }
            } else {
              console.log("[webhook/razorpay] order already exists, skipping duplicate:", razorpayOrderId);
            }
          } catch (err) {
            console.error("[webhook/razorpay] DB persist error:", err);
          }
        }
      }
      break;
    }

    case "payment.failed": {
      const payment = (event.payload as { payment?: { entity?: Record<string, unknown> } })
        ?.payment?.entity;
      if (payment) {
        console.log("[webhook/razorpay] payment.failed", {
          paymentId: payment.id,
          orderId: payment.order_id,
          errorDescription: payment.error_description,
        });
        // In production: mark order as failed, notify user
      }
      break;
    }

    case "refund.created": {
      const refund = (event.payload as { refund?: { entity?: Record<string, unknown> } })
        ?.refund?.entity;
      if (refund) {
        console.log("[webhook/razorpay] refund.created", {
          refundId: refund.id,
          paymentId: refund.payment_id,
          amount: refund.amount,
        });
        // In production: mark order as refunded, revoke access to asset
      }
      break;
    }

    default:
      // Acknowledge unhandled events without error
      console.log("[webhook/razorpay] unhandled event:", event.event);
  }

  return NextResponse.json({ received: true });
}
