"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchRandomQuoteFromZenQuotes } from "@/lib/quotes-api"
import type { Quote } from "@/lib/quotes-api"

// Initial quotes to display while loading
const INITIAL_QUOTES: Quote[] = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein",
  },
  {
    text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.",
    author: "Akshay Dubey",
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not just the car you're driving.",
    author: "Noam Shpancer",
  },
]

export default function QuotesCarousel() {
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const nextQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length)
  }

  // Load quotes from API on mount
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        // Fetch 5 random quotes from the API
        const newQuotes: Quote[] = []
        for (let i = 0; i < 5; i++) {
          const quote = await fetchRandomQuoteFromZenQuotes()
          newQuotes.push(quote)
          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
        setQuotes(newQuotes)
      } catch (error) {
        console.error("[v0] Failed to load quotes:", error)
        // Keep initial quotes if API fails
      } finally {
        setIsLoading(false)
      }
    }

    loadQuotes()
  }, [])

  // Auto-rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Daily Inspiration</h2>
          <p className="text-lg text-muted-foreground">Words to guide your journey to inner peace</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {quotes.map((quote, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-full bg-gradient-to-br from-card via-card/95 to-card border border-primary/20 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <CardContent className="p-12 md:p-16 text-center">
                    <div className="mb-8">
                      <svg className="w-12 h-12 text-accent mx-auto opacity-40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-6 0-8.812 4.021-8.812 8.006C-5.812 15.806 2.016 21 3 21z" />
                      </svg>
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-semibold text-foreground mb-6 leading-relaxed italic">
                      "{quote.text}"
                    </blockquote>
                    <p className="text-lg text-primary font-medium">— {quote.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 rounded-full bg-primary text-white hover:bg-primary/90 border-0"
            onClick={prevQuote}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous quote</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={nextQuote}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next quote</span>
          </Button>

          <div className="flex justify-center mt-6 gap-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-primary/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
