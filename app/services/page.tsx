"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Heart, Brain, Lightbulb, TrendingUp, Zap } from "lucide-react"
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "@/components/animated-scroll"

export const metadata = {
  title: "Our Services - Inner Serenity Counselling Centre",
  description: "Explore our comprehensive counselling and mental health services tailored to your needs",
}

const services = [
  {
    id: "individual",
    title: "Individual Therapy",
    icon: Heart,
    description: "One-on-one counselling tailored to your unique needs and goals",
    details: [
      "Personalized treatment plans",
      "Flexible scheduling options",
      "Evidence-based therapeutic approaches",
      "Safe, confidential environment",
    ],
    price: 120,
    duration: "50 minutes",
  },
  {
    id: "couples",
    title: "Couples Counselling",
    icon: Users,
    description: "Strengthen your relationship with professional guidance",
    details: [
      "Improve communication skills",
      "Resolve conflicts effectively",
      "Rebuild trust and intimacy",
      "Navigate life transitions together",
    ],
    price: 150,
    duration: "50 minutes",
  },
  {
    id: "family",
    title: "Family Therapy",
    icon: Zap,
    description: "Heal family dynamics and improve communication",
    details: [
      "Address family conflicts",
      "Improve parent-child relationships",
      "Navigate major transitions",
      "Build healthier family patterns",
    ],
    price: 150,
    duration: "50 minutes",
  },
  {
    id: "cbt",
    title: "Cognitive Behavioral Therapy",
    icon: Brain,
    description: "Evidence-based treatment for anxiety and depression",
    details: [
      "Identify negative thought patterns",
      "Develop coping strategies",
      "Change unhelpful behaviors",
      "Proven effectiveness for anxiety & depression",
    ],
    price: 120,
    duration: "50 minutes",
  },
  {
    id: "mindfulness",
    title: "Mindfulness Practices",
    icon: Lightbulb,
    description: "Learn techniques to reduce stress and increase awareness",
    details: [
      "Meditation guidance",
      "Breathing techniques",
      "Stress reduction practices",
      "Increased emotional awareness",
    ],
    price: 120,
    duration: "50 minutes",
  },
  {
    id: "stress",
    title: "Stress Management",
    icon: TrendingUp,
    description: "Develop effective coping strategies",
    details: [
      "Identify stress triggers",
      "Learn relaxation techniques",
      "Build resilience",
      "Create sustainable habits",
    ],
    price: 120,
    duration: "50 minutes",
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive counselling services designed to support your mental health and wellbeing. Whether you're
            seeking individual therapy, couples counselling, or family support, we have the expertise to help.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <FadeInOnScroll>
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <StaggerItem key={service.id}>
                  <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-foreground">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.details.map((detail, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-4 mt-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Session Price</p>
                          <p className="text-2xl font-bold text-primary">${service.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="text-lg font-semibold">{service.duration}</p>
                        </div>
                      </div>
                      <Button asChild className="w-full rounded-full">
                        <Link href="/booking">Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </StaggerItem>
              )
            })}
            </StaggerContainer>
          </div>
        </section>
      </FadeInOnScroll>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Schedule a Session",
                description: "Browse our services, choose a time that works for you, and book your initial consultation.",
              },
              {
                step: "2",
                title: "Initial Assessment",
                description:
                  "During your first session, we'll discuss your goals, concerns, and create a personalized treatment plan.",
              },
              {
                step: "3",
                title: "Ongoing Therapy",
                description: "Work with your therapist in regular sessions to address your concerns and make positive changes.",
              },
              {
                step: "4",
                title: "Progress & Growth",
                description: "Track your progress, develop new skills, and build a foundation for long-term mental wellness.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session Format Options */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Session Format Options</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>In-Person Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Meet with your therapist at our comfortable, private office space designed to promote relaxation and
                  open dialogue.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Personalized office environment</li>
                  <li>✓ Direct face-to-face interaction</li>
                  <li>✓ Professional, confidential setting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Virtual Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with your therapist from the comfort of your home via secure video call, combining convenience
                  with professional support.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Convenient and flexible</li>
                  <li>✓ Secure video platform</li>
                  <li>✓ Same therapeutic quality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take the first step toward inner serenity. Book your initial consultation today.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/booking">Book Your First Session</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
