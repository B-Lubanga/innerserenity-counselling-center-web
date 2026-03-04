// Calendar Synchronization Service
// Automatically books counselor calendars when clients make appointments

export interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  counsellorId: string
  clientName: string
  clientEmail: string
  bookingId: string
  meetingUrl: string
  eventType: 'session' | 'break' | 'unavailable'
}

export interface CounsellorAvailability {
  counsellorId: string
  weekdayStart: number // 10 (10 AM)
  weekdayEnd: number // 17 (5 PM)
  saturdayStart?: number // Optional Saturday hours
  saturdayEnd?: number
  breakTimes: { start: string; end: string }[] // e.g., [{start: "13:00", end: "14:00"}]
  unavailableDates: string[] // ISO date strings
}

// Default counselor availability (10 AM - 5 PM weekdays)
const DEFAULT_AVAILABILITY: CounsellorAvailability = {
  counsellorId: 'default',
  weekdayStart: 10,
  weekdayEnd: 17,
  breakTimes: [{ start: '12:00', end: '13:00' }],
  unavailableDates: [],
}

// Create calendar event for counselor when booking is confirmed
export async function syncBookingToCalendar(
  counsellorId: string,
  clientName: string,
  clientEmail: string,
  sessionDate: Date,
  sessionDuration: number, // in minutes
  bookingId: string,
  meetingUrl: string
): Promise<boolean> {
  try {
    const endTime = new Date(sessionDate.getTime() + sessionDuration * 60000)

    const event: CalendarEvent = {
      id: `cal-${bookingId}-${Date.now()}`,
      title: `Counselling Session - ${clientName}`,
      description: `Appointment with ${clientName}\nEmail: ${clientEmail}\nBooking ID: ${bookingId}`,
      startTime: sessionDate,
      endTime,
      counsellorId,
      clientName,
      clientEmail,
      bookingId,
      meetingUrl,
      eventType: 'session',
    }

    // Call the calendar API to create the event
    const response = await fetch('/api/calendar/sync-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      console.error('[v0] Failed to sync booking to calendar:', response.status)
      return false
    }

    console.log('[v0] Booking synced to counselor calendar:', {
      counsellorId,
      clientName,
      sessionDate: sessionDate.toISOString(),
    })

    return true
  } catch (error) {
    console.error('[v0] Error syncing to calendar:', error)
    return false
  }
}

// Send calendar notification to counselor
export async function notifyCounsellorOfBooking(
  counsellorEmail: string,
  counsellorName: string,
  clientName: string,
  sessionDate: Date,
  meetingUrl: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/calendar/notify-counsellor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        counsellorEmail,
        counsellorName,
        clientName,
        sessionDate: sessionDate.toISOString(),
        meetingUrl,
      }),
    })

    if (!response.ok) {
      console.error('[v0] Failed to notify counselor:', response.status)
      return false
    }

    console.log('[v0] Counselor notification sent:', counsellorEmail)
    return true
  } catch (error) {
    console.error('[v0] Error notifying counselor:', error)
    return false
  }
}

// Get counselor's available slots for a given date
export async function getCounsellorAvailability(
  counsellorId: string,
  date: Date
): Promise<string[]> {
  try {
    // In production, fetch from database
    // For now, return mock availability
    const availability = DEFAULT_AVAILABILITY
    const dayOfWeek = date.getDay()

    // Check if date is unavailable
    const dateStr = date.toISOString().split('T')[0]
    if (availability.unavailableDates.includes(dateStr)) {
      return []
    }

    // Check if it's a weekend (Saturday = 6)
    if (dayOfWeek === 0 || (dayOfWeek === 6 && !availability.saturdayStart)) {
      return []
    }

    // Generate hourly slots
    const slots: string[] = []
    const startHour = dayOfWeek === 6 && availability.saturdayStart ? availability.saturdayStart : availability.weekdayStart
    const endHour = dayOfWeek === 6 && availability.saturdayEnd ? availability.saturdayEnd : availability.weekdayEnd

    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`

      // Skip break times
      const isDuringBreak = availability.breakTimes.some(
        (breakTime) => time >= breakTime.start && time < breakTime.end
      )

      if (!isDuringBreak) {
        slots.push(time)
      }
    }

    return slots
  } catch (error) {
    console.error('[v0] Error getting availability:', error)
    return []
  }
}

// Block time on counselor's calendar (for breaks, vacations, etc.)
export async function blockCalendarTime(
  counsellorId: string,
  startTime: Date,
  endTime: Date,
  reason: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/calendar/block-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        counsellorId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        reason,
      }),
    })

    if (!response.ok) {
      console.error('[v0] Failed to block calendar time:', response.status)
      return false
    }

    console.log('[v0] Calendar time blocked:', { counsellorId, startTime, reason })
    return true
  } catch (error) {
    console.error('[v0] Error blocking calendar:', error)
    return false
  }
}
