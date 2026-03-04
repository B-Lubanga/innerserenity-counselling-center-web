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
      ease: "easeOut",
    },
  }),
}

export default function Hero() {
  return (
    <div className="relative bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Individual Therapy Card */}
          <motion.div
            className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            custom={0}
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            <div className="relative h-full">
              <div className="relative w-full h-80">
                <Image
                  src="/images/therapy-session-individual.jpg"
                  alt="Individual therapy session"
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background" />
              </div>
              <div className="p-8 bg-gradient-to-t from-card to-card/50">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Individual Therapy</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  One-on-one counselling tailored to your unique needs and goals.
                </p>
                <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/booking">Book Session</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Couples Therapy Card */}
          <motion.div
            className="bg-card border border-accent/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            custom={1}
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            <div className="relative h-full">
              <div className="relative w-full h-80">
                <Image
                  src="/images/therapy-session-couples.jpg"
                  alt="Couples therapy session"
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-transparent to-background" />
              </div>
              <div className="p-8 bg-gradient-to-t from-card to-card/50">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Couples Therapy</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Strengthen relationships and improve communication with professional support.
                </p>
                <Button size="sm" className="rounded-full bg-accent hover:bg-accent/90" asChild>
                  <Link href="/services">Learn More</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Family Therapy Card */}
          <motion.div
            className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            custom={2}
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            <div className="relative h-full">
              <div className="relative w-full h-80">
                <Image
                  src="/images/therapy-session-family.jpg"
                  alt="Family therapy session"
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background" />
              </div>
              <div className="p-8 bg-gradient-to-t from-card to-card/50">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Family Therapy</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Support families in navigating challenges and building healthier relationships.
                </p>
                <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/about">Discover</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
