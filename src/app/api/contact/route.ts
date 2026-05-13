import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyContactSubmission } from "@/lib/notify-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, sector, inquiryType, message } = body;

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: "Name, email, inquiry type, and message are required" },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone, company, sector, inquiryType, message },
    });

    // Fire-and-forget admin email notification (never blocks the response)
    notifyContactSubmission({ name, email, phone, company, sector, inquiryType, message }).catch(
      (err) => console.error("[contact] notify failed:", err)
    );

    return NextResponse.json(
      { message: "Thank you! We'll be in touch within 24 hours.", id: submission.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
