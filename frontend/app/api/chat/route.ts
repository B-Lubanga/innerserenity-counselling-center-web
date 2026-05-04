import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiUrl = typeof window === 'undefined'  
      ? (process.env.INTERNAL_API_URL || 'http://innerserenity-backend:8000')
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    
    const response = await fetch(`${apiUrl}/api/messaging/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // Graceful fallback when backend/Ollama is unavailable
    return NextResponse.json({
      response: "Thank you for reaching out to Inner Serenity Counselling Centre. " +
        "Our team is here to help. For immediate assistance, please WhatsApp us or " +
        "call during office hours: Monday–Friday, 10:00 AM – 7:00 PM.",
      whatsapp_fallback: true,
      whatsapp_url: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}` 
    })
  }
}
