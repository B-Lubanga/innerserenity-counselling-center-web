import { NextResponse } from 'next/server'
import { getRandomQuote } from '@/lib/quotes-api'

export async function GET() {
  try {
    const quote = getRandomQuote()
    return NextResponse.json({
      text: quote.content,
      author: quote.author
    })
  } catch (error) {
    console.error('[v0] Quote API error:', error)
    return NextResponse.json({
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha"
    })
  }
}
