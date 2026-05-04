"use client"

import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, CheckCircle, Clock, User, Mail } from "lucide-react"
import { MOCK_AVAILABILITY, BOOKED_SLOTS } from "@/lib/constants"
import { getAvailableSlots } from "@/lib/helpers"

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>()
  const [step, setStep] = useState(1)
  const [timeSlot, setTimeSlot] = useState<string>()
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [meetingUrl, setMeetingUrl] = useState<string>()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sessionType: "",
    counsellorPreference: "",
    concerns: "",
  })

  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date)
      setTimeSlot(undefined)
    }
  }, [date])

  const fetchAvailableSlots = async (selectedDate: Date) => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(`/api/availability/slots?date=${dateStr}`)
      
      if (response.ok) {
        const slots = await response.json()
        setAvailableSlots(slots)
      } else {
        console.error('Failed to fetch slots:', response.status)
        setAvailableSlots([])
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setAvailableSlots([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sessionType: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, counsellorPreference: value }))
  }

  const handleTimeSelect = (time: string) => {
    setTimeSlot(time)
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const sendConfirmationEmail = async () => {
    try {
      if (!date || !timeSlot) return false

      const response = await fetch("/api/email/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          sessionType: formData.sessionType,
          counsellorPreference: formData.counsellorPreference,
          concerns: formData.concerns,
          date: date.toISOString(),
          time: timeSlot,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Email API error:", response.status)
        return false
      }

      const result = await response.json()
      // Email sent successfully
      return result.success
    } catch (error) {
      console.error("[v0] Failed to send confirmation email:", error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !timeSlot) {
      toast({
        title: "Error",
        description: "Please select a date and time.",
        variant: "destructive",
      })
      return
    }

    try {
      // Prepare booking data for backend
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        session_type: formData.sessionType,
        concerns: formData.concerns,
        date: date.toISOString(),
        time: timeSlot,
      }

      // Submit booking to backend
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Booking failed')
      }

      const result = await response.json()
      // Booking created successfully

      // Store meeting URL if it's a virtual session
      if (result.meeting_url) {
        setMeetingUrl(result.meeting_url)
      }

      // Send confirmation email (non-critical)
      try {
        await sendConfirmationEmail()
      } catch (emailError) {
        // Email failed (non-critical)
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your session is booked for ${date.toLocaleDateString()} at ${timeSlot}. Reference: ${result.booking_reference}`,
      })

      setStep(4)
    } catch (error) {
      console.error("[v0] Booking submission error:", error)
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "There was an issue processing your booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSlotStatus = (slot: string) => {
    const dateKey = date?.toISOString().split("T")[0]
    const booked = BOOKED_SLOTS[dateKey as keyof typeof BOOKED_SLOTS] || []
    return booked.includes(slot) ? "booked" : "available"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Book Your Session</h1>
          <p className="text-lg text-muted-foreground">Schedule a counselling appointment with our experienced therapists</p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    step >= stepNumber
                      ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-110"
                      : "bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="h-6 w-6" /> : stepNumber}
                </div>
                <span className="text-xs mt-3 text-center font-medium text-muted-foreground">
                  {stepNumber === 1 && "Personal Info"}
                  {stepNumber === 2 && "Select Date & Time"}
                  {stepNumber === 3 && "Review"}
                  {stepNumber === 4 && "Confirmed"}
                </span>
                {stepNumber < 4 && <div className="flex-1 h-1 bg-secondary/30 mx-2 mt-6" />}
              </div>
            ))}
          </div>
          <div className="w-full bg-secondary/30 h-2 mt-8 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
        <Card className="bg-secondary/50 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Please provide your details so we can contact you about your session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="bg-background/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="bg-background/80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                required
                className="bg-background/80"
              />
            </div>

            <div className="space-y-2">
              <Label>Session Type</Label>
              <RadioGroup value={formData.sessionType} onValueChange={handleRadioChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person">In-Person Session</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="virtual" id="virtual" />
                  <Label htmlFor="virtual">Virtual Session</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counsellorPreference">Counsellor Preference</Label>
              <Select value={formData.counsellorPreference} onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-background/80">
                  <SelectValue placeholder="Select a preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-preference">No Preference</SelectItem>
                  <SelectItem value="dr-smith">Dr. Smith (Anxiety, Depression)</SelectItem>
                  <SelectItem value="dr-johnson">Dr. Johnson (Couples Therapy)</SelectItem>
                  <SelectItem value="dr-williams">Dr. Williams (Family Therapy)</SelectItem>
                  <SelectItem value="dr-brown">Dr. Brown (Trauma, PTSD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concerns">What brings you to counselling?</Label>
              <Textarea
                id="concerns"
                name="concerns"
                value={formData.concerns}
                onChange={handleInputChange}
                placeholder="Please briefly describe your concerns or what you'd like to work on in therapy."
                rows={4}
                className="bg-background/80"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNextStep} className="rounded-full">
              Next: Select Date & Time
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-card border-2 border-primary/20 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CalendarIcon className="h-6 w-6 text-primary" />
              Select Your Preferred Date & Time
            </CardTitle>
            <CardDescription>Choose your appointment from available slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar - prominent on left */}
              <div className="lg:col-span-1">
                <Label className="mb-4 block text-lg font-semibold text-foreground">Select a Date</Label>
                <div className="border-2 border-primary/20 rounded-2xl bg-background/50 p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full"
                    disabled={(date) => {
                      const now = new Date()
                      now.setHours(0, 0, 0, 0)
                      const threeMonthsLater = new Date()
                      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
                      const dateKey = date.toISOString().split("T")[0]
                      const hasAvailability =
                        MOCK_AVAILABILITY[dateKey as keyof typeof MOCK_AVAILABILITY]?.length > 0
                      return (
                        date < now ||
                        date > threeMonthsLater ||
                        date.getDay() === 0 || // Sunday
                        !hasAvailability
                      )
                    }}
                  />
                </div>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-foreground font-medium">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-foreground font-medium">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-muted-foreground">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Time Slots - prominent on right */}
              <div className="lg:col-span-2">
                <Label className="mb-4 block text-lg font-semibold text-foreground">Available Time Slots</Label>
                {date ? (
                  <div className="space-y-4">
                    {availableSlots.length > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-4">
                          Available slots for <span className="font-bold text-primary">{date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableSlots.map((time) => (
                            <Button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`h-16 rounded-xl font-semibold transition-all text-base ${
                                timeSlot === time
                                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-105"
                                  : "bg-secondary border-2 border-primary/20 hover:border-primary/50 hover:shadow-md"
                              }`}
                            >
                              <Clock className="mr-2 h-5 w-5" />
                              {time}
                            </Button>
                          ))}
                        </div>

                        {/* Show booked slots for reference */}
                        {date && BOOKED_SLOTS[date.toISOString().split("T")[0] as keyof typeof BOOKED_SLOTS]?.length > 0 && (
                          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
                            <Label className="text-sm font-semibold text-foreground mb-3 block">Booked Time Slots (Unavailable):</Label>
                            <div className="flex flex-wrap gap-2">
                              {BOOKED_SLOTS[date.toISOString().split("T")[0] as keyof typeof BOOKED_SLOTS].map((slot) => (
                                <Badge key={slot} className="bg-accent/20 text-accent font-semibold px-3 py-1">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 bg-secondary/50 rounded-xl border-2 border-dashed border-primary/20">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-40 text-primary" />
                        <p className="text-lg font-semibold text-foreground mb-2">No available slots</p>
                        <p className="text-muted-foreground">Please select another date</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-primary/20 rounded-xl bg-secondary/50">
                    <div className="text-center">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-30 text-primary" />
                      <p className="text-lg font-semibold text-foreground">Select a date to view available times</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep} className="rounded-full">
              Back
            </Button>
            <Button onClick={handleNextStep} disabled={!date || !timeSlot} className="rounded-full">
              Next: Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-secondary/50 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Review Your Booking</CardTitle>
            <CardDescription>Please review your information before confirming your booking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p>{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p>{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p>{formData.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Session Type:</span>
                    <p>{formData.sessionType === "in-person" ? "In-Person Session" : "Virtual Session"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Counsellor Preference:</span>
                    <p>
                      {formData.counsellorPreference === "no-preference"
                        ? "No Preference"
                        : formData.counsellorPreference}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p>
                      {date?.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <p>{timeSlot}</p>
                  </div>
                  <div className="pt-4">
                    <span className="text-muted-foreground">Concerns/Notes:</span>
                    <p className="mt-1">{formData.concerns || "No concerns specified."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background/80 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-medium">Email Confirmation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A confirmation email will be sent to <strong>{formData.email}</strong> with your appointment details and
                any necessary preparation instructions.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep} className="rounded-full">
              Back
            </Button>
            <Button onClick={handleSubmit} className="rounded-full">
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 4 && (
        <Card className="text-center bg-secondary/50 border-none shadow-sm">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your counselling session has been scheduled successfully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">
                {date?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}{" "}
                at {timeSlot}
              </p>
              <p className="text-muted-foreground mt-1">
                {formData.sessionType === "in-person" ? "In-Person Session" : "Virtual Session"}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Mail className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700 dark:text-green-400">Email Sent!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300">
                Confirmation email sent to <strong>{formData.email}</strong>
              </p>
            </div>

            {meetingUrl && (
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-700 dark:text-orange-400">Virtual Session Link</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-300 mb-3">
                  Your secure meeting room is ready. Join at the scheduled time.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#E09132] hover:bg-[#C87A2A] text-white rounded-full"
                >
                  <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
                    Join Session
                  </a>
                </Button>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-center">
                  Link: {meetingUrl}
                </p>
              </div>
            )}
            <div className="bg-background/80 p-4 rounded-md mt-6 text-left">
              <p className="font-medium">What's Next?</p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>Check your email for detailed appointment information</li>
                <li>For virtual sessions, you'll receive a secure meeting link</li>
                <li>Please arrive 10 minutes early for in-person sessions</li>
                <li>If you need to reschedule, please give at least 24 hours notice</li>
                <li>Complete any intake forms sent via email before your session</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
        )}
      </div>
    </div>
  )
}
