import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { counsellorEmail, counsellorName, clientName, sessionDate, meetingUrl } = await request.json()

    if (!counsellorEmail || !clientName || !sessionDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[v0] Counsellor notification request:', {
      counsellorEmail,
      counsellorName,
      clientName,
      sessionDate,
    })

    // In production, send email using Resend or SendGrid
    // const response = await resend.emails.send({
    //   from: 'noreply@innerserenity.com',
    //   to: counsellorEmail,
    //   subject: `New Appointment Confirmed - ${clientName}`,
    //   html: counsellorNotificationTemplate(counsellorName, clientName, sessionDate, meetingUrl),
    // })

    console.log('[v0] Counsellor notified:', counsellorEmail)

    return NextResponse.json(
      {
        success: true,
        message: 'Counsellor notification sent',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Notification error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}

// Email template for counsellor
function counsellorNotificationTemplate(
  counsellorName: string,
  clientName: string,
  sessionDate: string,
  meetingUrl: string
): string {
  const time = new Date(sessionDate).toLocaleString()

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1B5E20 0%, #BF5700 100%); color: white; padding: 40px; text-align: center; border-radius: 12px;">
        <h1 style="margin: 0; font-size: 28px;">New Session Scheduled</h1>
      </div>

      <div style="padding: 40px; background: #f9f9f9;">
        <p style="font-size: 16px; color: #333;">Hi ${counsellorName},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          A new appointment has been scheduled with your client.
        </p>

        <div style="background: white; border-left: 4px solid #1B5E20; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #1B5E20;">Appointment Details</p>
          <p style="margin: 5px 0;"><strong>Client:</strong> ${clientName}</p>
          <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${time}</p>
        </div>

        <p style="font-size: 16px; color: #333; margin: 20px 0;">
          Join the session when ready:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${meetingUrl}" style="background: linear-gradient(135deg, #1B5E20 0%, #BF5700 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
            Open Meeting Room
          </a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          The meeting room will be available 15 minutes before the scheduled time.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 14px; color: #666;">
          If you need to reschedule or have any concerns, please contact support.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 20px;">
          Inner Serenity Counselling Centre
        </p>
      </div>
    </div>
  `
}
