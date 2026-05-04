import { NextResponse } from 'next/server'
import type { CalendarEvent } from '@/lib/calendar-sync'

// In-memory calendar storage (replace with database in production)
const counsellorCalendars = new Map<string, CalendarEvent[]>()

export async function POST(request: Request) {
  try {
    const {
      counsellorId,
      clientName,
      clientEmail,
      sessionDate,
      sessionDuration,
      bookingId,
    } = await request.json()

    // Validate required fields
    if (!counsellorId || !sessionDate || !bookingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create counselor's calendar
    if (!counsellorCalendars.has(counsellorId)) {
      counsellorCalendars.set(counsellorId, [])
    }

    const calendar = counsellorCalendars.get(counsellorId)!
    const startTime = new Date(sessionDate)
    const endTime = new Date(new Date(sessionDate).getTime() + (sessionDuration || 50) * 60000)

    // Check for conflicts
    const hasConflict = calendar.some(
      (existing) =>
        existing.eventType === 'session' &&
        new Date(existing.startTime) < endTime &&
        new Date(existing.endTime) > startTime
    )

    if (hasConflict) {
      console.error('[v0] Calendar conflict detected for:', counsellorId)
      return NextResponse.json({ error: 'Time slot conflicts with existing appointment' }, { status: 409 })
    }

    // Create calendar event
    const event: CalendarEvent = {
      id: `cal-${bookingId}-${Date.now()}`,
      title: `Counselling Session - ${clientName}`,
      description: `Client: ${clientName}\nEmail: ${clientEmail}\nBooking ID: ${bookingId}`,
      startTime,
      endTime,
      counsellorId,
      clientName,
      clientEmail,
      bookingId,
      meetingUrl: `/meeting/${bookingId}`,
      eventType: 'session',
    }

    // Add event to calendar
    calendar.push(event)
    console.log('[v0] Event synced to calendar:', event.id)

    // Log to console for debugging
    console.log('[v0] Counselor calendar updated:', {
      counsellorId: event.counsellorId,
      totalEvents: calendar.length,
      newEvent: {
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
      },
    })

    return NextResponse.json(
      {
        success: true,
        eventId: event.id,
        message: 'Booking synced to counselor calendar',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Calendar sync error:', error)
    return NextResponse.json({ error: 'Failed to sync booking' }, { status: 500 })
  }
}

// GET endpoint to retrieve counsellor's calendar
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const counsellorId = searchParams.get('counsellorId')
    const dateStr = searchParams.get('date')

    if (!counsellorId) {
      return NextResponse.json({ error: 'Missing counsellorId' }, { status: 400 })
    }

    const calendar = counsellorCalendars.get(counsellorId) || []

    // Filter by date if provided
    let filteredEvents = calendar
    if (dateStr) {
      const targetDate = new Date(dateStr)
      filteredEvents = calendar.filter((event) => {
        const eventDate = new Date(event.startTime)
        return eventDate.toDateString() === targetDate.toDateString()
      })
    }

    return NextResponse.json({
      success: true,
      counsellorId,
      events: filteredEvents.map((e) => ({
        ...e,
        startTime: e.startTime.toISOString(),
        endTime: e.endTime.toISOString(),
      })),
      totalEvents: filteredEvents.length,
    })
  } catch (error) {
    console.error('[v0] Calendar retrieval error:', error)
    return NextResponse.json({ error: 'Failed to retrieve calendar' }, { status: 500 })
  }
}
