// Virtual Meeting Service - Manages video calls and meeting links
// Uses WebRTC with Simple Peer or Jitsi for production

export interface MeetingSession {
  id: string
  clientId: string
  counsellorId: string
  bookingId: string
  startTime: Date
  endTime: Date
  meetingUrl: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  recordingUrl?: string
}

export interface MeetingParticipant {
  id: string
  name: string
  role: 'client' | 'counsellor'
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  joinedAt: Date
}

// Generate unique meeting URL (in production, integrate with Jitsi, Zoom, etc.)
export function generateMeetingUrl(bookingId: string): string {
  // Format: yoursite.com/meeting/[bookingId]?token=[secure-token]
  const token = Buffer.from(`${bookingId}-${Date.now()}`).toString('base64')
  return `/meeting/${bookingId}?token=${token}`
}

// Send meeting link to participant via email
export async function sendMeetingInvite(
  participantEmail: string,
  participantName: string,
  counsellorName: string,
  meetingUrl: string,
  meetingTime: Date
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/send-meeting-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: participantEmail,
        participantName,
        counsellorName,
        meetingUrl,
        meetingTime: meetingTime.toISOString(),
      }),
    })

    if (!response.ok) {
      console.error('[v0] Failed to send meeting invite:', response.status)
      return false
    }

    console.log('[v0] Meeting invite sent successfully to:', participantEmail)
    return true
  } catch (error) {
    console.error('[v0] Error sending meeting invite:', error)
    return false
  }
}

// Create meeting room and generate tokens for participants
export async function initializeMeeting(bookingId: string, counsellorId: string): Promise<MeetingSession | null> {
  try {
    const meetingUrl = generateMeetingUrl(bookingId)
    const now = new Date()
    const endTime = new Date(now.getTime() + 60 * 60 * 1000) // 60 minute session

    const session: MeetingSession = {
      id: `meeting-${bookingId}-${Date.now()}`,
      clientId: 'client-id-from-booking',
      counsellorId,
      bookingId,
      startTime: now,
      endTime,
      meetingUrl,
      status: 'scheduled',
    }

    console.log('[v0] Meeting initialized:', session.id)
    return session
  } catch (error) {
    console.error('[v0] Failed to initialize meeting:', error)
    return null
  }
}

// Validate meeting access token
export function validateMeetingToken(bookingId: string, token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [id, timestamp] = decoded.split('-')
    const tokenAge = Date.now() - parseInt(timestamp)
    
    // Token valid for 24 hours
    const isValid = id === bookingId && tokenAge < 24 * 60 * 60 * 1000
    
    console.log('[v0] Token validation:', { isValid, age: tokenAge })
    return isValid
  } catch (error) {
    console.error('[v0] Token validation error:', error)
    return false
  }
}

// End meeting and generate summary
export async function completeMeeting(
  sessionId: string,
  duration: number,
  notes: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/meetings/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        duration,
        notes,
        completedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      console.error('[v0] Failed to complete meeting:', response.status)
      return false
    }

    console.log('[v0] Meeting completed:', sessionId)
    return true
  } catch (error) {
    console.error('[v0] Error completing meeting:', error)
    return false
  }
}
