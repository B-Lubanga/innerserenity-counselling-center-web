"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Heart, Lightbulb } from "lucide-react"
import { FadeInOnScroll, SlideInOnScroll, StaggerContainer, StaggerItem } from "@/components/animated-scroll"

export const metadata = {
  title: "About Us - Inner Serenity Counselling Centre",
  description: "Learn about our team, mission, and commitment to mental health and wellness",
}

const team = [
  {
    name: "Dr. Sarah Johnson",
    role: "Clinical Director & Licensed Therapist",
    specialization: "Cognitive Behavioral Therapy, Anxiety Disorders",
    bio: "With over 15 years of clinical experience, Dr. Johnson specializes in evidence-based treatments for anxiety and depression.",
  },
  {
    name: "Michael Chen",
    role: "Licensed Marriage & Family Therapist",
    specialization: "Couples Counselling, Family Therapy",
    bio: "Michael brings compassion and expertise to help couples and families navigate their most challenging relationships.",
  },
  {
    name: "Emily Rodriguez",
    role: "Licensed Mental Health Counselor",
    specialization: "Trauma-Informed Care, PTSD",
    bio: "Emily specializes in helping individuals process trauma and rebuild their lives with resilience and hope.",
  },
  {
    name: "David Lee",
    role: "Licensed Mental Health Counselor",
    specialization: "Mindfulness-Based Therapy, Stress Management",
    bio: "David integrates mindfulness practices and stress reduction techniques for holistic wellness.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We approach every client with empathy, understanding, and genuine care.",
  },
  {
    icon: Lightbulb,
    title: "Evidence-Based",
    description: "All our treatments are grounded in the latest psychological research and best practices.",
  },
  {
    icon: Users,
    title: "Confidentiality",
    description: "Your privacy and trust are paramount. We maintain strict confidentiality standards.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We commit to continuous professional development and the highest standards of care.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <FadeInOnScroll>
        <section className="py-20 px-4 bg-gradient-to-b from-secondary/50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">About Inner Serenity</h1>
            <p className="text-xl text-muted-foreground">
              We are dedicated to providing compassionate, evidence-based counselling services that help individuals,
              couples, and families discover peace and balance in their lives.
            </p>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Mission & Vision */}
      <FadeInOnScroll>
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                To provide accessible, compassionate, and evidence-based counselling services that empower
                individuals to achieve mental wellness and personal growth.
              </p>
              <p>
                We believe that everyone deserves support on their journey toward inner serenity, and we are
                committed to creating a safe, non-judgmental space for transformation and healing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                To be the trusted counselling center in our community, recognized for excellence in mental health
                services and the positive impact we have on people's lives.
              </p>
              <p>
                We envision a world where seeking help for mental health is normalized, and where everyone has access
                to the support they need to live fulfilling, peaceful lives.
              </p>
            </CardContent>
          </Card>
          </div>

          {/* Core Values */}
          <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Team Section */}
      <FadeInOnScroll>
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-4">{member.specialization}</Badge>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Why Choose Us */}
      <FadeInOnScroll>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Inner Serenity?</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Experienced Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                Our team consists of licensed, experienced therapists with diverse specializations to meet your unique
                needs.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flexible Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                Choose between in-person or virtual sessions at times that work with your schedule, Monday-Friday
                9AM-7PM and Saturday 10AM-4PM.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidentiality & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                We maintain the highest standards of confidentiality and adhere to all relevant privacy laws and
                professional ethics codes.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evidence-Based Approaches</CardTitle>
              </CardHeader>
              <CardContent>
                We use proven therapeutic techniques and continuously stay updated with the latest developments in
                mental health care.
              </CardContent>
            </Card>
          </div>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  )
}
