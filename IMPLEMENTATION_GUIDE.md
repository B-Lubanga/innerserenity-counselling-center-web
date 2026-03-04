# Implementation Guide - Virtual Counselling Platform

## Quick Start

### What's Been Built

Your Inner Serenity Counselling Centre platform now includes:

1. **🎯 Random Mental Health Quotes API** - Fetches fresh quotes from free API
2. **📹 Virtual Meeting System** - Generates meeting URLs and sends invitations
3. **📅 Automatic Calendar Sync** - Counselor calendars update automatically when clients book
4. **📧 Smart Email Notifications** - Both clients and counselors get detailed emails
5. **🔒 Secure Meeting Tokens** - Unique tokens for each session

---

## System Architecture

```
Client Books Session
        ↓
Generate Booking ID & Meeting URL
        ↓
Send Client Confirmation Email (with meeting link)
        ↓
Sync to Counselor Calendar (prevents conflicts)
        ↓
Send Counselor Notification Email
        ↓
Both parties receive join link
        ↓
Virtual Meeting Begins
```

---

## Configuration Guide

### 1. Default Counselor Settings

**File**: `/lib/calendar-sync.ts`

```typescript
const DEFAULT_AVAILABILITY: CounsellorAvailability = {
  counsellorId: 'default',
  weekdayStart: 10,      // 10 AM
  weekdayEnd: 17,        // 5 PM
  breakTimes: [{ start: '12:00', end: '13:00' }], // Lunch break
  unavailableDates: [],
}
```

**To customize**:
- Change `weekdayStart` and `weekdayEnd` hours
- Add/modify `breakTimes` for lunch, breaks
- Add dates to `unavailableDates` for vacation

### 2. Email Configuration

**File**: `/app/api/calendar/notify-counsellor/route.ts`

Replace the placeholder email sending with your provider:

```typescript
// Add your API key to environment variables
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// Send email
const response = await resend.emails.send({
  from: 'noreply@innerserenity.com',
  to: counsellorEmail,
  subject: `New Appointment - ${clientName}`,
  html: counsellorNotificationTemplate(...)
})
```

### 3. Database Integration

Currently using in-memory storage. To use a database:

**Update `/app/api/calendar/sync-booking/route.ts`**:

```typescript
// Replace in-memory storage
const counsellorCalendars = new Map<string, CalendarEvent[]>()

// With database call
const calendar = await db
  .table('calendar_events')
  .where({ counsellorId })
  .select()
```

---

## API Endpoints Reference

### Create/Sync Booking

```http
POST /api/calendar/sync-booking
Content-Type: application/json

{
  "id": "cal-booking-123",
  "title": "Counselling Session - John Doe",
  "startTime": "2026-03-10T14:00:00Z",
  "endTime": "2026-03-10T14:50:00Z",
  "counsellorId": "counsellor-1",
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "bookingId": "booking-123",
  "meetingUrl": "/meeting/booking-123?token=...",
  "eventType": "session"
}
```

**Response**:
```json
{
  "success": true,
  "eventId": "cal-booking-123",
  "message": "Booking synced to counselor calendar"
}
```

### Get Availability

```http
GET /api/calendar/sync-booking?counsellorId=default&date=2026-03-10
```

**Response**:
```json
{
  "success": true,
  "counsellorId": "default",
  "events": [...],
  "totalEvents": 2
}
```

### Send Meeting Invite

```http
POST /api/meetings/invite
Content-Type: application/json

{
  "email": "client@example.com",
  "participantName": "John Doe",
  "counsellorName": "Dr. Sarah Johnson",
  "meetingUrl": "/meeting/booking-123?token=...",
  "meetingTime": "2026-03-10T14:00:00Z"
}
```

### Notify Counselor

```http
POST /api/calendar/notify-counsellor
Content-Type: application/json

{
  "counsellorEmail": "sarah@innerserenity.com",
  "counsellorName": "Dr. Sarah Johnson",
  "clientName": "John Doe",
  "sessionDate": "2026-03-10T14:00:00Z",
  "meetingUrl": "/meeting/booking-123?token=..."
}
```

---

## File Structure

```
project/
├── /lib/
│   ├── quotes-api.ts              # Quote fetching logic
│   ├── meeting-service.ts         # Meeting URL generation & management
│   ├── calendar-sync.ts           # Calendar synchronization
│
├── /hooks/
│   └── use-counselor-availability.ts # React hook for availability
│
├── /app/api/
│   ├── /meetings/
│   │   └── invite/route.ts        # Send meeting invitations
│   ├── /calendar/
│   │   ├── sync-booking/route.ts  # Calendar sync endpoint
│   │   ├── notify-counsellor/route.ts # Counselor notifications
│   │   └── block-time/route.ts    # Block unavailable times
│
├── /components/
│   └── quotes-carousel.tsx        # Quote carousel UI
│
├── /app/
│   └── booking/
│       └── page.tsx               # Updated with calendar sync
│
└── /FEATURES_IMPLEMENTED.md       # Feature documentation
```

---

## Usage Examples

### Example 1: Booking a Session (Frontend)

```typescript
import { syncBookingToCalendar, notifyCounsellorOfBooking } from '@/lib/calendar-sync'
import { generateMeetingUrl } from '@/lib/meeting-service'

const handleBooking = async (clientData, date, time) => {
  const bookingId = `booking-${Date.now()}`
  const meetingUrl = generateMeetingUrl(bookingId)
  
  const sessionDate = new Date(date)
  sessionDate.setHours(parseInt(time.split(':')[0]))
  
  // Sync to calendar
  await syncBookingToCalendar(
    'counsellor-1',
    clientData.name,
    clientData.email,
    sessionDate,
    50, // 50 minutes
    bookingId,
    meetingUrl
  )
  
  // Notify counselor
  await notifyCounsellorOfBooking(
    'counsellor@email.com',
    'Dr. Sarah',
    clientData.name,
    sessionDate,
    meetingUrl
  )
}
```

### Example 2: Get Available Slots

```typescript
import { useCounselorAvailability } from '@/hooks/use-counselor-availability'

export function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { slots, isLoading } = useCounselorAvailability('counsellor-1', selectedDate)
  
  return (
    <div>
      <DatePicker value={selectedDate} onChange={setSelectedDate} />
      {isLoading && <p>Loading availability...</p>}
      {slots.map(slot => (
        <button key={slot.time} disabled={!slot.available}>
          {slot.time}
        </button>
      ))}
    </div>
  )
}
```

### Example 3: Validate Meeting Token

```typescript
import { validateMeetingToken } from '@/lib/meeting-service'

export function MeetingPage({ params: { bookingId } }) {
  const token = new URLSearchParams(window.location.search).get('token')
  
  if (!validateMeetingToken(bookingId, token)) {
    return <div>Invalid or expired meeting link</div>
  }
  
  return <VideoMeetingRoom bookingId={bookingId} />
}
```

---

## Production Checklist

### Before Going Live

- [ ] **Email Service Setup**
  - [ ] Add RESEND_API_KEY to environment variables
  - [ ] Test email delivery
  - [ ] Update sender email address

- [ ] **Database Connection**
  - [ ] Connect to Supabase/PostgreSQL
  - [ ] Create calendar_events table
  - [ ] Add indexes on counsellorId, date

- [ ] **Video Conference**
  - [ ] Integrate Jitsi Meet or Daily.co
  - [ ] Test video/audio quality
  - [ ] Add recording capability

- [ ] **Security**
  - [ ] Enable HTTPS
  - [ ] Add rate limiting on APIs
  - [ ] Validate all user inputs
  - [ ] Test token validation

- [ ] **Monitoring**
  - [ ] Set up Sentry for error tracking
  - [ ] Add logging for all API calls
  - [ ] Monitor email delivery rates

- [ ] **Testing**
  - [ ] Test full booking flow
  - [ ] Verify calendar conflicts prevented
  - [ ] Check email delivery
  - [ ] Test virtual meeting access

---

## Debugging Tips

### Quote API Issues

```typescript
// Check API response
const response = await fetch('https://zenquotes.io/api/random')
const data = await response.json()
console.log('[v0] Quote API response:', data)
```

### Calendar Conflicts

```typescript
// Check calendar endpoint
const response = await fetch('/api/calendar/sync-booking?counsellorId=default')
const calendar = await response.json()
console.log('[v0] Calendar events:', calendar.events)
```

### Meeting URL Issues

```typescript
// Validate token
import { validateMeetingToken } from '@/lib/meeting-service'
const isValid = validateMeetingToken('booking-123', token)
console.log('[v0] Token valid:', isValid)
```

---

## Troubleshooting

### Problem: Quotes not loading
**Solution**: Check browser console for API errors. Fallback quotes should display.

### Problem: Calendar conflicts showing
**Solution**: Review conflicting times in calendar endpoint response.

### Problem: Email not sent
**Solution**: Ensure RESEND_API_KEY is set. Check email template formatting.

### Problem: Meeting token invalid
**Solution**: Token expires after 24 hours. Generate new booking link.

---

## Performance Optimization

### Caching

```typescript
// Quote responses cached for 1 hour
const response = await fetch(url, {
  next: { revalidate: 3600 }
})
```

### Database Queries

```typescript
// Add indexes for faster queries
CREATE INDEX idx_calendar_counsellor_date 
ON calendar_events(counsellorId, date)
```

### Rate Limiting

```typescript
// Implement rate limiting on API endpoints
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30
})
```

---

## Support & Resources

- **Quotable API Docs**: https://quotable.io/docs
- **Zen Quotes API**: https://zenquotes.io/
- **Resend Email**: https://resend.com/docs
- **Jitsi Meet**: https://jitsi.org/user-faq/
- **Daily.co**: https://www.daily.co/docs

---

## Version History

- **v1.0** (Current)
  - Quote API integration
  - Virtual meeting system
  - Calendar synchronization
  - Email notifications
  - Admin dashboard
  - Dark/light mode support
