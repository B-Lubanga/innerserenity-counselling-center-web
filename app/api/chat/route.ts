import { streamOllamaChat, COUNSELING_SYSTEM_PROMPT } from "@/lib/ollama-service"
import { determineInquiryType, getSystemPrompt, shouldEscalate } from "@/lib/chat-system"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400 })
    }

    // Determine the inquiry type from the latest user message
    const lastUserMessage = messages[messages.length - 1]?.content || ""
    const inquiryType = determineInquiryType(lastUserMessage)
    const systemPrompt = getSystemPrompt(inquiryType)

    // Check if conversation should be escalated
    const shouldEscalateConversation = shouldEscalate(lastUserMessage, messages.length)

    // Format messages for Ollama
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    // Add system prompt as first message for Ollama
    const messagesWithSystem = [
      {
        role: "system",
        content: `${COUNSELING_SYSTEM_PROMPT}

${systemPrompt}

${shouldEscalateConversation ? "NOTE: This conversation may need escalation to a human representative. Prepare a brief summary if requested." : ""}`,
      },
      ...formattedMessages,
    ]

    // Stream response from Ollama
    const response = await streamOllamaChat(messagesWithSystem)

    INNER SERENITY COUNSELLING CENTRE - COMPREHENSIVE INFORMATION:

    // Stream response with proper formatting
    const reader = response.body?.getReader()
    if (!reader) {
      return new Response(JSON.stringify({ error: "Failed to stream response" }), { status: 500 })
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const decoder = new TextDecoder()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const json = JSON.parse(line)
                  if (json.message?.content) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content: json.message.content })}\n\n`)
                    )
                  }
                } catch (e) {
                  console.log("[v0] Parse error:", e)
                }
              }
            }
          }

          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Chat service error" }), { status: 500 })
  }
}
