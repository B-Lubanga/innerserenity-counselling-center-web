"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, X, ExternalLink } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { apiCallWithAuth } from "@/lib/auth"
import { toast } from "sonner"

interface Booking {
  id: number
  booking_reference?: string
  scheduled_at: string
  status: string
  service_type_name: string
  counsellor_name: string
  meeting_url?: string
  notes?: string
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (isAuthenticated && user) {
      fetchBookings()
    }
  }, [isAuthenticated, isLoading, user, router])

  const fetchBookings = async () => {
    try {
      setIsLoadingBookings(true)
      setError(null)
      const data = await apiCallWithAuth<Booking[]>("/api/bookings/my-bookings")
      setBookings(data.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()))
    } catch (err) {
      setError("Failed to load your bookings")
      console.error("Error fetching bookings:", err)
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setIsCancelling(bookingId)
      await apiCallWithAuth(`/api/bookings/${bookingId}/cancel`, {
        method: "POST"
      })
      
      toast.success("Booking cancelled successfully")
      fetchBookings() // Refresh the list
    } catch (err) {
      toast.error("Failed to cancel booking")
      console.error("Error cancelling booking:", err)
    } finally {
      setIsCancelling(null)
    }
  }

  const canJoinSession = (booking: Booking) => {
    const now = new Date()
    const sessionTime = new Date(booking.scheduled_at)
    const timeDiff = sessionTime.getTime() - now.getTime()
    const thirtyMinutes = 30 * 60 * 1000
    
    return (
      booking.status === "confirmed" &&
      booking.meeting_url &&
      timeDiff <= thirtyMinutes &&
      timeDiff > -60 * 60 * 1000 // Within 1 hour after start time
    )
  }

  const canCancel = (booking: Booking) => {
    const now = new Date()
    const sessionTime = new Date(booking.scheduled_at)
    const timeDiff = sessionTime.getTime() - now.getTime()
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    return (
      (booking.status === "pending" || booking.status === "confirmed") &&
      timeDiff > twentyFourHours
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
      pending: { variant: "secondary", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      confirmed: { variant: "default", color: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { variant: "destructive", color: "bg-red-100 text-red-800 border-red-200" },
      completed: { variant: "outline", color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
    
    const config = variants[status] || variants.pending
    
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-KE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apricot mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-ivory py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fern mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your counselling session bookings</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center text-red-800">
                <X className="h-5 w-5 mr-2" />
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                  onClick={fetchBookings}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoadingBookings ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apricot mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-fern mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't booked any counselling sessions yet.
              </p>
              <Button asChild className="bg-apricot hover:bg-apricot/90 text-ivory">
                <Link href="/booking">Book Your First Session</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-fern">
                          {booking.service_type_name}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      {booking.booking_reference && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Reference: {booking.booking_reference}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(booking.scheduled_at)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(booking.scheduled_at)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {booking.meeting_url ? "Online Session" : "In-Person"}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="h-4 w-4 mr-2">👤</span>
                          {booking.counsellor_name}
                        </div>
                      </div>

                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mb-3">
                          Notes: {booking.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {canJoinSession(booking) && (
                          <Button asChild className="bg-apricot hover:bg-apricot/90 text-ivory">
                            <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-2" />
                              Join Session
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        
                        {canCancel(booking) && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={isCancelling === booking.id}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            {isCancelling === booking.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="border-apricot text-apricot hover:bg-apricot hover:text-ivory">
            <Link href="/booking">Book New Session</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
