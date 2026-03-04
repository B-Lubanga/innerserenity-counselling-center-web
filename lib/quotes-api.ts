// Quotable API - Free mental health and wellness quotes API
// Alternative APIs: api.quotable.io, zenquotes.io

export interface Quote {
  text: string
  author: string
}

// Fallback quotes in case API fails
const FALLBACK_QUOTES: Quote[] = [
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
  {
    text: "The greatest wealth is health.",
    author: "Virgil",
  },
  {
    text: "Taking joy in living is a woman's best cosmetic.",
    author: "Rosie O'Donnell",
  },
  {
    text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
  },
  {
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
  },
  {
    text: "The only way out is through.",
    author: "Robert Frost",
  },
]

// Mental health themed keywords for Quotable API
const MENTAL_HEALTH_TAGS = ["meditation", "mindfulness", "peace", "healing", "mental", "wellbeing"]

export async function fetchRandomQuotes(count: number = 10): Promise<Quote[]> {
  try {
    // Using Quotable API - popular, free, no auth required
    const tag = MENTAL_HEALTH_TAGS[Math.floor(Math.random() * MENTAL_HEALTH_TAGS.length)]
    const response = await fetch(
      `https://api.quotable.io/random?limit=${count}&tags=${tag}&maxLength=150`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      console.error("[v0] Quotable API error:", response.status)
      return FALLBACK_QUOTES
    }

    const data = await response.json()

    // Map API response to our Quote interface
    if (Array.isArray(data)) {
      return data.map((q: any) => ({
        text: q.content,
        author: q.author.replace(", type.fit", ""), // Clean up author name
      }))
    } else if (data.content) {
      return [
        {
          text: data.content,
          author: data.author.replace(", type.fit", ""),
        },
        ...FALLBACK_QUOTES.slice(0, count - 1),
      ]
    }

    return FALLBACK_QUOTES
  } catch (error) {
    console.error("[v0] Failed to fetch quotes:", error)
    return FALLBACK_QUOTES
  }
}

// Client-side safe quote fetcher that works with Quotable API
export async function fetchRandomQuoteFromZenQuotes(): Promise<Quote> {
  try {
    // Try Quotable API first (more reliable)
    const tagIndex = Math.floor(Math.random() * MENTAL_HEALTH_TAGS.length)
    const tag = MENTAL_HEALTH_TAGS[tagIndex]
    
    const response = await fetch(
      `https://api.quotable.io/random?maxLength=150&tags=${tag}`,
      {
        next: { revalidate: 1800 },
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data.content && data.author) {
        return {
          text: data.content,
          author: data.author.replace(", type.fit", "").split(",")[0], // Clean author name
        }
      }
    }

    // Fallback to random quote from local array
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
  } catch (error) {
    console.log("[v0] Quote API unavailable, using fallback")
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
  }
}
