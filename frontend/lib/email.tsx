import { BookingFormData } from "./types"
import { CENTER_INFO, formatDate } from "./constants"

/**
 * Generate booking confirmation email HTML
 */
export function generateBookingConfirmationEmail(
  booking: BookingFormData & { date: Date; time: string }
): string {
  const dateStr = booking.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #5bb7a0;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2d5a5a;
            margin: 0;
          }
          .header p {
            color: #5bb7a0;
            margin: 5px 0 0 0;
          }
          .content {
            margin: 30px 0;
          }
          .booking-details {
            background-color: #f0faf8;
            padding: 20px;
            border-left: 4px solid #5bb7a0;
            margin: 20px 0;
            border-radius: 4px;
          }
          .detail-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
          }
          .detail-label {
            font-weight: bold;
            color: #2d5a5a;
          }
          .detail-value {
            color: #555;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            background-color: #5bb7a0;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${CENTER_INFO.name}</h1>
            <p>Appointment Confirmation</p>
          </div>

          <div class="content">
            <p>Dear ${booking.name},</p>

            <p>Thank you for booking a counselling session with us. Your appointment has been confirmed with the following details:</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${dateStr}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${booking.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Session Type:</span>
                <span class="detail-value">${booking.sessionType === "in-person" ? "In-Person Session" : "Virtual Session"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">50 minutes</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Cost:</span>
                <span class="detail-value">$${CENTER_INFO.sessionPrice}</span>
              </div>
            </div>

            <p>Please note the following important information:</p>
            <ul>
              <li>Please arrive 10 minutes early for your session</li>
              <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
              ${booking.sessionType === "virtual" ? '<li>You will receive a video call link 24 hours before your session</li>' : '<li>Our office is located at [Address to be added]</li>'}
              <li>Please bring a valid ID to your appointment</li>
            </ul>

            <p>If you have any questions or need to reschedule, please don't hesitate to contact us:</p>
            <p>
              <strong>Phone:</strong> ${CENTER_INFO.phone}<br>
              <strong>Email:</strong> ${CENTER_INFO.email}<br>
              <strong>Hours:</strong> Monday-Friday ${CENTER_INFO.hours.weekday}, Saturday ${CENTER_INFO.hours.saturday}
            </p>

            <p>We look forward to supporting you on your journey to inner serenity.</p>

            <p>Best regards,<br>
            <strong>The Inner Serenity Team</strong></p>
          </div>

          <div class="footer">
            <p>&copy; 2024 ${CENTER_INFO.name}. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate contact form confirmation email HTML
 */
export function generateContactConfirmationEmail(
  name: string,
  email: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            background-color: #f9fafb;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #5bb7a0;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2d5a5a;
            margin: 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${CENTER_INFO.name}</h1>
            <p>Message Received</p>
          </div>

          <p>Dear ${name},</p>

          <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>

          <p>In the meantime, if you have any urgent concerns, please feel free to call us directly at ${CENTER_INFO.phone}.</p>

          <p>Best regards,<br>
          <strong>The Inner Serenity Team</strong></p>

          <div class="footer">
            <p>&copy; 2024 ${CENTER_INFO.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
