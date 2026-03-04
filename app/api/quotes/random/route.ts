import { NextResponse } from 'next/server'

const FALLBACK_QUOTES = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.", author: "Akshay Dubey" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Mental health is not a destination, but a process.", author: "Noam Shpancer" },
  { text: "The greatest wealth is health.", author: "Virgil" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The only way out is through.", author: "Robert Frost" },
]

export async function GET() {
  try {
    // Use Quotable API with CORS-friendly endpoint
    const tags = ['meditation', 'mindfulness', 'peace', 'healing', 'mental']
    const randomTag = tags[Math.floor(Math.random() * tags.length)]
    
    const response = await fetch(
      `https://api.quotable.io/random?tags=${randomTag}&maxLength=150`,
      {
        headers: {
          'User-Agent': 'Inner-Serenity-App/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      text: data.content || data.text,
      author: data.author ? data.author.replace(', type.fit', '') : 'Unknown'
    })
  } catch (error) {
    console.error('[v0] Quote API error:', error)
    // Return a random fallback quote
    const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
    return NextResponse.json(fallback)
  }
}
