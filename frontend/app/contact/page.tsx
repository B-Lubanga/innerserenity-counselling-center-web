"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { CENTER_INFO } from "@/lib/constants"
import { FadeInOnScroll, SlideInOnScroll } from "@/components/animated-scroll"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      // Contact form submitted

      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you as soon as possible.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have questions or ready to schedule your first appointment? We're here to help. Reach out to us today.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

            <div className="space-y-6">
              {/* Phone */}
              <Card>
                <CardContent className="pt-6 flex gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">{CENTER_INFO.phone}</p>
                    <p className="text-sm text-muted-foreground mt-2">Mon-Fri 10AM-7PM</p>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardContent className="pt-6 flex gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">{CENTER_INFO.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">We'll respond within 24 hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardContent className="pt-6 flex gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Location</h3>
                    {/* TODO: Update address */}
                    <p className="text-muted-foreground">123 Wellness Street</p>
                    <p className="text-muted-foreground">Serenity City, SC 12345</p>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardContent className="pt-6 flex gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: {CENTER_INFO.hours.weekday}</p>
                    <p className="text-muted-foreground">Saturday: {CENTER_INFO.hours.saturday}</p>
                    <p className="text-muted-foreground">Sunday: {CENTER_INFO.hours.sunday}</p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      We are closed on weekends. For urgent support outside office hours, please contact a crisis helpline.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enquiry – Inner Serenity Counselling Centre"
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: "How do I book an appointment?",
                answer:
                  "You can book an appointment directly through our website by clicking 'Book a Session' in the navigation menu. Select your preferred date, time, and session type.",
              },
              {
                question: "Do you offer virtual sessions?",
                answer:
                  "Yes, we offer both in-person and virtual sessions. You can choose your preference when booking.",
              },
              {
                question: "What is your cancellation policy?",
                answer: "We require 24 hours notice for cancellations. Cancellations made with less notice may be subject to a fee.",
              },
              {
                question: "Is my information confidential?",
                answer:
                  "Yes, we maintain strict confidentiality and comply with all relevant privacy laws. Your information is secure and private.",
              },
              {
                question: "How much does a session cost?",
                answer: "Session costs vary depending on the service. Most sessions are $120 for 50 minutes. See our Services page for detailed pricing.",
              },
              {
                question: "Do you accept insurance?",
                answer:
                  "We accept most major insurance plans. Please contact us directly to verify your coverage.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Don't wait to begin your journey toward inner serenity. Book your first appointment today.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <a href="/booking">Book Your Appointment</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
