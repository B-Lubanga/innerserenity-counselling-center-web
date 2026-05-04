"use client"

import Hero from "@/components/hero"
import QuotesCarousel from "@/components/quotes-carousel"
import Services from "@/components/services"
import SelfAssessment from "@/components/self-assessment"
import VirtualTherapyPreview from "@/components/virtual-therapy-preview"
import MoodTracker from "@/components/mood-tracker"
import Testimonials from "@/components/testimonials"
import BookingCTA from "@/components/booking-cta"
import ContactSection from "@/components/contact-section"
import CrisisSupport from "@/components/crisis-support"
import { FadeInOnScroll } from "@/components/animated-scroll"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FadeInOnScroll>
        <QuotesCarousel />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <Services />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <SelfAssessment />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <VirtualTherapyPreview />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <MoodTracker />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <Testimonials />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <BookingCTA />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <CrisisSupport />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ContactSection />
      </FadeInOnScroll>
    </main>
  )
}
