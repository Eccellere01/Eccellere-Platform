import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT SET";
  // Show host/db but redact password
  const redacted = dbUrl.replace(/:([^@]+)@/, ":****@");
  
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ status: "ok", userCount: count, dbUrl: redacted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: "error", error: message, dbUrl: redacted }, { status: 500 });
  }
}
