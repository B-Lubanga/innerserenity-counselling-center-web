// Ollama integration for local LLM inference
// This service connects to Ollama running locally (default: http://localhost:11434)

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral" // Default model, can be changed to llama2, neural-chat, etc.

interface OllamaMessage {
  role: "user" | "assistant"
  content: string
}

interface OllamaRequest {
  model: string
  messages: OllamaMessage[]
  stream: boolean
  temperature?: number
}

interface OllamaResponse {
  model: string
  created_at: string
  message: {
    role: string
    content: string
  }
  done: boolean
}

/**
 * Get available Ollama models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    if (!response.ok) {
      console.error("[v0] Failed to fetch Ollama models:", response.status)
      return [OLLAMA_MODEL]
    }
    const data = await response.json()
    return data.models?.map((m: any) => m.name) || [OLLAMA_MODEL]
  } catch (error) {
    console.error("[v0] Error fetching Ollama models:", error)
    return [OLLAMA_MODEL]
  }
}

/**
 * Stream chat completion using Ollama
 */
export async function streamOllamaChat(messages: OllamaMessage[]) {
  const payload: OllamaRequest = {
    model: OLLAMA_MODEL,
    messages,
    stream: true,
    temperature: 0.7,
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    return response
  } catch (error) {
    console.error("[v0] Ollama streaming error:", error)
    throw error
  }
}

/**
 * Single chat completion (non-streaming) using Ollama
 */
export async function ollamaChat(messages: OllamaMessage[]): Promise<string> {
  const payload: OllamaRequest = {
    model: OLLAMA_MODEL,
    messages,
    stream: false,
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data: OllamaResponse = await response.json()
    return data.message.content
  } catch (error) {
    console.error("[v0] Ollama chat error:", error)
    throw error
  }
}

/**
 * System prompt for counselling assistant
 */
export const COUNSELLING_SYSTEM_PROMPT = `You are an empathetic and professional mental health counselling assistant for Inner Serenity Counselling Centre. Your role is to:

1. Provide supportive and compassionate responses to users' mental health questions
2. Offer basic psychoeducation about common mental health concerns
3. Help users understand different counselling services available
4. Guide users toward booking appropriate counselling sessions
5. Provide crisis resources when needed
6. Never diagnose, prescribe, or provide crisis medical intervention

Services offered:
- Individual therapy for anxiety, depression, trauma, and personal growth
- Couples therapy for relationship challenges
- Family therapy for family dynamics and conflicts
- Group sessions for peer support

Important: Always remind users that while you provide support and information, professional in-person therapy is the best approach for ongoing mental health care.

Maintain a warm, non-judgmental tone. If asked about crisis situations, provide emergency numbers:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741`
