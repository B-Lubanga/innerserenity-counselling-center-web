"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "@/lib/animations"

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

export default function Hero() {
  return (
    <div className="relative bg-fern min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-apricot/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-natural/10 rounded-full blur-3xl -ml-32 -mb-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-ivory mb-6">
            Find Your Inner Peace
          </h1>
          <div className="w-24 h-1 bg-apricot mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-ivory/80 font-body max-w-3xl mx-auto">
            Professional counselling services to help you discover balance, healing, and personal growth in a safe, supportive environment.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Button size="lg" className="rounded-full bg-apricot hover:bg-apricot/90 text-ivory font-semibold px-8 py-4" asChild>
            <Link href="/booking">Book a Session</Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full border-apricot text-apricot hover:bg-apricot hover:text-ivory font-semibold px-8 py-4" asChild>
            <Link href="/services">Our Services</Link>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Individual Therapy Card */}
          <motion.div
            className="bg-ivory border-l-4 border-fern rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            custom={0}
            variants={cardVariants}
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-apricot/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-apricot" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-fern mb-4">Individual Therapy</h2>
              <p className="text-fern/80 font-body mb-6">
                One-on-one counselling tailored to your unique needs and goals.
              </p>
              <Button size="sm" className="rounded-full bg-fern hover:bg-fern-light text-ivory" asChild>
                <Link href="/booking">Book Session</Link>
              </Button>
            </div>
          </motion.div>

          {/* Couples Therapy Card */}
          <motion.div
            className="bg-ivory border-l-4 border-apricot rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            custom={1}
            variants={cardVariants}
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-apricot/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-apricot" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-fern mb-4">Couples Therapy</h2>
              <p className="text-fern/80 font-body mb-6">
                Strengthen relationships and improve communication with professional support.
              </p>
              <Button size="sm" className="rounded-full bg-fern hover:bg-fern-light text-ivory" asChild>
                <Link href="/services">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          {/* Family Therapy Card */}
          <motion.div
            className="bg-ivory border-l-4 border-natural rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            custom={2}
            variants={cardVariants}
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-apricot/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-apricot" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-fern mb-4">Family Therapy</h2>
              <p className="text-fern/80 font-body mb-6">
                Support families in navigating challenges and building healthier relationships.
              </p>
              <Button size="sm" className="rounded-full bg-fern hover:bg-fern-light text-ivory" asChild>
                <Link href="/about">Discover</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
