import { useState, useEffect } from 'react'
import { getCounsellorAvailability } from '@/lib/calendar-sync'

interface AvailabilitySlot {
  time: string
  available: boolean
}

export function useCounsellorAvailability(counsellorId: string, date: Date | null) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!date) {
      setSlots([])
      return
    }

    const fetchAvailability = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get available time slots from counsellor's calendar
        const availableSlots = await getCounsellorAvailability(counsellorId, date)

        // Map to slot objects
        const slotObjects: AvailabilitySlot[] = availableSlots.map((time) => ({
          time,
          available: true,
        }))

        setSlots(slotObjects)
        console.log('[v0] Availability slots loaded:', slotObjects.length)
      } catch (err) {
        console.error('[v0] Error fetching availability:', err)
        setError('Failed to load available time slots')
        setSlots([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [counsellorId, date])

  return { slots, isLoading, error }
}
