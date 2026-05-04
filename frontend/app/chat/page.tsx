"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, MessageCircle } from "lucide-react"

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

export default function ChatPage() {
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
    setMessages((prev) => [...prev, userMessage])
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])

      if (data.whatsapp_fallback && data.whatsapp_link) {
        setWhatsappFallback({ show: true, link: data.whatsapp_link })
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble connecting. Please try again or contact us via WhatsApp." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-8">
      <div className="max-w-4xl mx-auto px-4 h-screen md:h-auto md:max-h-[80vh]">
        <Card className="w-full h-full md:h-[80vh] flex flex-col border-fern-200 shadow-2xl bg-white">
          <CardHeader className="border-b border-fern-100 bg-fern-50">
            <CardTitle className="text-2xl md:text-3xl text-fern-900">Chat Support</CardTitle>
            <CardDescription className="text-fern-700">
              Our AI assistant is here to help with questions about our services, booking sessions, or mental wellness topics.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow overflow-y-auto space-y-4 p-6 bg-ivory-50/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6 p-6 rounded-full bg-fern-100">
                  <MessageCircle className="h-12 w-12 text-fern-600" />
                </div>
                <p className="text-2xl font-bold text-fern-900 mb-2">Welcome to Inner Serenity</p>
                <p className="max-w-md text-fern-700">
                  Ask us about our counselling services, how to book a session, mental wellness tips, or any other questions you have.
                </p>
                <div className="mt-6 grid gap-2 text-left">
                  <p className="text-sm font-semibold text-fern-900">Common topics:</p>
                  <ul className="text-sm text-fern-700 space-y-1">
                    <li>• How to book a counselling session</li>
                    <li>• Our available services and pricing</li>
                    <li>• Mental health resources and tips</li>
                    <li>• Frequently asked questions</li>
                  </ul>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-3 max-w-[85%] sm:max-w-[70%]`}>
                    {message.role !== "user" && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-fern-600 flex items-center justify-center text-white text-xs font-bold">
                          IS
                        </div>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        message.role === "user"
                          ? "bg-apricot-500 text-white rounded-br-none"
                          : "bg-ivory-100 text-fern-900 rounded-bl-none border border-fern-200 shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-fern-200 flex items-center justify-center text-xs font-bold text-fern-700">
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
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  Continue on WhatsApp
                </Button>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-fern-600 flex items-center justify-center text-white text-xs font-bold">
                      IS
                    </div>
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-ivory-100 rounded-bl-none border border-fern-200 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-fern-600 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-fern-600 animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-fern-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t border-fern-100 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex w-full gap-3">
              <Input
                placeholder="Ask anything about our services, mental wellness, or booking..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="rounded-full border-fern-200 focus:border-fern-400 bg-ivory-50"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-fern-600 hover:bg-fern-700 text-white font-semibold px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
