import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard/profile
 * Returns the authenticated user's profile (User + ClientProfile) for the
 * client dashboard Settings page and the sidebar/topbar header.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      clientProfile: {
        select: {
          companyName: true,
          businessType: true,
          sector: true,
          subSector: true,
          revenueRange: true,
          employeeRange: true,
          gstin: true,
          city: true,
          state: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Derive a "plan" label from role (no Subscription model populated yet)
  const planLabel =
    user.role === "ADMIN" || user.role === "SUPER_ADMIN"
      ? "Admin"
      : user.role === "SPECIALIST"
      ? "Specialist"
      : "Client";

  // Split full name into first/last for the form
  const parts = (user.name ?? "").trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      firstName,
      lastName,
      email: user.email,
      phone: user.phone ?? "",
      role: user.role,
      planLabel,
    },
    clientProfile: user.clientProfile ?? null,
  });
}

/**
 * PATCH /api/dashboard/profile
 * Updates editable fields on User and ClientProfile.
 */
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const phone = str(body.phone);
  const city = str(body.city);
  const state = str(body.state);
  const companyName = str(body.companyName);
  const sector = str(body.sector);
  const employeeRange = str(body.employeeRange);
  const gstin = str(body.gstin);

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const userUpdate: Record<string, unknown> = {};
  if (fullName) userUpdate.name = fullName;
  if (phone) userUpdate.phone = phone;

  const profileUpdate: Record<string, unknown> = {};
  if (city) profileUpdate.city = city;
  if (state) profileUpdate.state = state;
  if (companyName) profileUpdate.companyName = companyName;
  if (sector) profileUpdate.sector = sector;
  if (employeeRange) profileUpdate.employeeRange = employeeRange;
  if (gstin !== undefined) profileUpdate.gstin = gstin;

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...userUpdate,
        ...(Object.keys(profileUpdate).length > 0
          ? {
              clientProfile: {
                update: profileUpdate,
              },
            }
          : {}),
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error("[profile PATCH]", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
