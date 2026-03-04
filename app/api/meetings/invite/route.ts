import { NextResponse } from 'next/server'

// Email sending would be integrated here with Resend or similar
// For now, return success and log the meeting invite details

export async function POST(request: Request) {
  try {
    const { email, participantName, counsellorName, meetingUrl, meetingTime } = await request.json()

    if (!email || !meetingUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[v0] Meeting invite request:', {
      email,
      participantName,
      counsellorName,
      meetingTime,
    })

    // In production, send email using Resend API:
    // const response = await resend.emails.send({
    //   from: 'noreply@innerserenity.com',
    //   to: email,
    //   subject: `Your Virtual Session with ${counsellorName} - Inner Serenity`,
    //   html: meetingInviteTemplate(participantName, counsellorName, meetingUrl, meetingTime),
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Meeting invite sent',
        meetingUrl,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Meeting invite error:', error)
    return NextResponse.json({ error: 'Failed to send meeting invite' }, { status: 500 })
  }
}

// Email template helper
function meetingInviteTemplate(
  participantName: string,
  counsellorName: string,
  meetingUrl: string,
  meetingTime: string
): string {
  const time = new Date(meetingTime).toLocaleString()

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1B5E20 0%, #BF5700 100%); color: white; padding: 40px; text-align: center; border-radius: 12px;">
        <h1 style="margin: 0; font-size: 28px;">Your Virtual Session Awaits</h1>
      </div>

      <div style="padding: 40px; background: #f9f9f9;">
        <p style="font-size: 16px; color: #333;">Dear ${participantName},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Your counselling session with <strong>${counsellorName}</strong> is scheduled for:
        </p>

        <div style="background: white; border-left: 4px solid #1B5E20; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1B5E20;">${time}</p>
        </div>

        <p style="font-size: 16px; color: #333; margin: 20px 0;">
          Click the button below to join your session:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${meetingUrl}" style="background: linear-gradient(135deg, #1B5E20 0%, #BF5700 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
            Join Session
          </a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If you cannot access the link above, copy and paste this URL in your browser:
        </p>
        <p style="font-size: 12px; color: #999; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
          ${meetingUrl}
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 14px; color: #666;">
          If you have any questions or need to reschedule, please contact us at support@innerserenity.com
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 20px;">
          Inner Serenity Counselling Centre<br>
          Supporting your journey to peace and wellbeing
        </p>
      </div>
    </div>
  `
}
