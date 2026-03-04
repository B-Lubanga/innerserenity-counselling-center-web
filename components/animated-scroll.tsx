'use client'

import { motion, useScroll, useTransform, useViewportScroll } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
}

export function FadeInOnScroll({ children, className = '' }: ScrollAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  )
}

export function SlideInOnScroll({ children, className = '', direction = 'left' }: ScrollAnimationProps & { direction?: 'left' | 'right' }) {
  const x = direction === 'left' ? -50 : 50
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleInOnScroll({ children, className = '' }: ScrollAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '' }: ScrollAnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: ScrollAnimationProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxScroll({ children, className = '', offset = 50 }: ScrollAnimationProps & { offset?: number }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, offset])
  
  return (
    <motion.div
      className={className}
      style={{ y }}
      will-change="transform"
    >
      {children}
    </motion.div>
  )
}

// Optimized container for multiple animated children
export function AnimatedGrid({ children, className = '', columns = 3 }: { children: React.ReactNode; className?: string; columns?: number }) {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
