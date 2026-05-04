"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatResponse {
  response: string
  whatsapp_fallback: boolean
  whatsapp_link?: string
  session_id: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [whatsappFallback, setWhatsappFallback] = useState<{ show: boolean; link?: string }>({ show: false })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = { role: "user", content: input }
    setMessages((prev: ChatMessage[]) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setWhatsappFallback({ show: false })

    try {
      const response = await fetch("/api/messaging/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          session_id: sessionId || undefined,
        }),
      })

      const data: ChatResponse = await response.json()

      setSessionId(data.session_id)
      setMessages((prev: ChatMessage[]) => [...prev, { role: "assistant", content: data.response }])

      if (data.whatsapp_fallback && data.whatsapp_link) {
        setWhatsappFallback({ show: true, link: data.whatsapp_link })
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble connecting. Please try again or contact us via WhatsApp." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-fern-600 hover:bg-fern-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 max-h-[500px] flex flex-col">
      <Card className="shadow-2xl border-fern-200 bg-white">
        <CardHeader className="border-b border-fern-100 bg-fern-50 py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-fern-900">Chat with us</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-fern-600 hover:text-fern-900 hover:bg-fern-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto space-y-3 p-4 bg-ivory-50/50 max-h-[350px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="mb-3 p-3 rounded-full bg-fern-100">
                <MessageCircle className="h-6 w-6 text-fern-600" />
              </div>
              <p className="text-sm font-semibold text-fern-900 mb-1">Welcome to Inner Serenity</p>
              <p className="text-xs text-fern-700 max-w-[200px]">
                Ask us about our services, booking, or mental wellness.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {message.role !== "user" && (
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-fern-600 flex items-center justify-center text-white text-xs font-bold">
                        IS
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-3 py-2 text-xs ${
                      message.role === "user"
                        ? "bg-fern-600 text-white rounded-br-none"
                        : "bg-white text-fern-900 rounded-bl-none border border-fern-200 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-fern-200 flex items-center justify-center text-xs font-bold text-fern-700">
                        You
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {whatsappFallback.show && whatsappFallback.link && (
            <div className="flex justify-start">
              <Button
                onClick={() => window.open(whatsappFallback.link, "_blank")}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full text-xs h-8"
              >
                Continue on WhatsApp
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-fern-600 flex items-center justify-center text-white text-xs font-bold">
                    IS
                  </div>
                </div>
                <div className="rounded-xl px-3 py-2 bg-white rounded-bl-none border border-fern-200 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-fern-600 animate-bounce" />
                    <div className="h-1.5 w-1.5 rounded-full bg-fern-600 animate-bounce [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-fern-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t border-fern-100 p-3 bg-white">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="rounded-full border-fern-200 focus:border-fern-400 bg-ivory-50 text-sm h-9"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-fern-600 hover:bg-fern-700 text-white h-9 w-9 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
