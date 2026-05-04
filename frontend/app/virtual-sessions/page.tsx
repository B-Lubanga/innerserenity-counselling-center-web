import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Lock, Clock, Smartphone, CheckCircle, ArrowRight } from "lucide-react"

export default function VirtualSessionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">Virtual Counselling</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Therapy from Anywhere
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access our expert counselling services from the comfort of your home through secure, 
            private video sessions powered by Jitsi Meet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#E09132] hover:bg-[#C87A2A] text-white rounded-full px-8" asChild>
              <Link href="/booking">Book a Virtual Session</Link>
            </Button>
            <Button variant="outline" className="rounded-full px-8" asChild>
              <Link href="/#services">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Virtual Sessions Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Book Your Session</CardTitle>
                <CardDescription>
                  Select "Virtual" as your session type when booking. Choose a convenient date and time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Receive Meeting Link</CardTitle>
                <CardDescription>
                  Get a unique, secure Jitsi Meet link for your session. No account needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Join Your Session</CardTitle>
                <CardDescription>
                  Click the link at your scheduled time. Join from any device with a browser.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Virtual Therapy?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Convenience & Comfort</h3>
                  <p className="text-muted-foreground">
                    Attend sessions from your safe space without travel time or commuting stress.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Jitsi Meet provides end-to-end encryption. Your sessions are completely confidential.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No Account Required</h3>
                  <p className="text-muted-foreground">
                    Simply click your meeting link - no downloads, no sign-ups, no hassle.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
                  <p className="text-muted-foreground">
                    More appointment slots available for virtual sessions, including evenings.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Same Quality Care</h3>
                  <p className="text-muted-foreground">
                    Research shows virtual therapy is as effective as in-person sessions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cost Effective</h3>
                  <p className="text-muted-foreground">
                    Save on travel costs and time. Same professional care at your convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-16 px-4 bg-background/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What You'll Need</h2>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Device:</strong> Computer, tablet, or smartphone with a camera and microphone
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Internet:</strong> Stable internet connection (minimum 5 Mbps recommended)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Browser:</strong> Any modern web browser (Chrome, Firefox, Safari, Edge)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Environment:</strong> Quiet, private space where you won't be interrupted
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-lg">
                Book your virtual session today and take the first step towards better mental health.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-[#E09132] hover:bg-[#C87A2A] text-white rounded-full px-8 py-6 text-lg" asChild>
                <Link href="/booking">
                  Book Virtual Session
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
