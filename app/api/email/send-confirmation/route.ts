import { NextRequest, NextResponse } from "next/server"
import { generateBookingConfirmationEmail } from "@/lib/email"
import type { BookingFormData } from "@/lib/types"

/**
 * POST /api/email/send-confirmation
 * Sends a booking confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, date, time, sessionType } = body

    // Validation
    if (!email || !name || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    const booking: BookingFormData & { date: Date; time: string } = {
      name,
      email,
      date: new Date(date),
      time,
      sessionType,
      phone: body.phone || "",
      counsellorPreference: body.counsellorPreference || "",
      concerns: body.concerns || "",
    }

    const emailHtml = generateBookingConfirmationEmail(booking)

    // Send email using a mock service for now
    // In production, integrate with Resend, SendGrid, etc.
    console.log("[v0] Sending confirmation email to:", email)
    console.log("[v0] Email subject: Appointment Confirmation - Inner Serenity Counselling Centre")

    // For demo purposes, we'll simulate email sending
    // In production, uncomment and use actual email service:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "noreply@innerserenity.com",
      to: email,
      subject: "Appointment Confirmation - Inner Serenity Counselling Centre",
      html: emailHtml,
    })
    */

    return NextResponse.json(
      {
        success: true,
        message: "Confirmation email sent successfully",
        data: { email, name, date, time },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send confirmation email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
