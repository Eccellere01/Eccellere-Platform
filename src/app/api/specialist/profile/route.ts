import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/specialist/profile
 * Returns the authenticated specialist's User + SpecialistProfile data for
 * the specialist sidebar header and the My Profile page.
 */
const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Application under review",
  UNDER_REVIEW: "Under review",
  REVISIONS_REQUESTED: "Revisions requested",
  APPROVED: "Approved",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
};

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

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
      specialistProfile: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sp = user.specialistProfile;
  const status = sp?.status ?? "APPLIED";
  const statusLabel = STATUS_LABELS[status] ?? status;

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      role: user.role,
    },
    specialistProfile: sp
      ? {
          headline: sp.headline ?? "",
          bio: sp.bio ?? "",
          linkedinUrl: sp.linkedinUrl ?? "",
          currentRole: sp.currentRole ?? "",
          organisation: sp.organisation ?? "",
          experienceYears: sp.experienceYears ?? "",
          availability: sp.availability ?? "",
          hourlyRateMin: sp.hourlyRateMin ?? null,
          hourlyRateMax: sp.hourlyRateMax ?? null,
          serviceDomains: asStringArray(sp.serviceDomains),
          sectorExpertise: asStringArray(sp.sectorExpertise),
          engagementTypes: asStringArray(sp.engagementTypes),
          languages: asStringArray(sp.languages),
          status,
          statusLabel,
          averageRating: sp.averageRating ?? 0,
          totalAssignments: sp.totalAssignments ?? 0,
        }
      : null,
    statusLabel,
  });
}

/**
 * PATCH /api/specialist/profile
 * Allows the specialist to update editable profile fields.
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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, specialistProfile: { select: { id: true } } },
  });
  if (!user || user.role !== "SPECIALIST") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!user.specialistProfile) {
    return NextResponse.json({ error: "Specialist profile not found" }, { status: 404 });
  }

  const allowed: Record<string, unknown> = {};
  const stringFields = [
    "headline",
    "bio",
    "linkedinUrl",
    "currentRole",
    "organisation",
    "experienceYears",
    "availability",
  ];
  for (const f of stringFields) {
    if (typeof body[f] === "string") allowed[f] = body[f];
  }
  const arrayFields = ["serviceDomains", "sectorExpertise", "engagementTypes", "languages"];
  for (const f of arrayFields) {
    if (Array.isArray(body[f])) allowed[f] = body[f];
  }
  if (typeof body.hourlyRateMin === "number") allowed.hourlyRateMin = body.hourlyRateMin;
  if (typeof body.hourlyRateMax === "number") allowed.hourlyRateMax = body.hourlyRateMax;

  if (typeof body.name === "string" && body.name.trim()) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: body.name.trim() },
    });
  }

  await prisma.specialistProfile.update({
    where: { id: user.specialistProfile.id },
    data: allowed,
  });

  return NextResponse.json({ success: true });
}
