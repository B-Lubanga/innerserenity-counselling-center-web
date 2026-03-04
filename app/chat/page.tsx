"use client"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-8">
      <div className="max-w-4xl mx-auto px-4 h-screen md:h-auto md:max-h-[80vh]">
        <Card className="w-full h-full md:h-[80vh] flex flex-col border-primary/20 shadow-2xl">
          <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-2xl md:text-3xl">Chat Support</CardTitle>
            <CardDescription>
              Our AI assistant is here to help with questions about our services, booking sessions, or mental wellness topics.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow overflow-y-auto space-y-4 p-6 bg-card">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6 p-6 rounded-full bg-primary/10">
                  <Send className="h-12 w-12 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">Welcome to Inner Serenity</p>
                <p className="max-w-md text-muted-foreground">
                  Ask us about our counselling services, how to book a session, mental wellness tips, or any other questions you have.
                </p>
                <div className="mt-6 grid gap-2 text-left">
                  <p className="text-sm font-semibold text-foreground">Common topics:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• How to book a counselling session</li>
                    <li>• Our available services and pricing</li>
                    <li>• Mental health resources and tips</li>
                    <li>• Frequently asked questions</li>
                  </ul>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-3 max-w-[85%] md:max-w-[70%]">
                    {message.role !== "user" && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                          IS
                        </div>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-primary to-accent text-white rounded-br-none"
                          : "bg-secondary text-foreground rounded-bl-none border border-primary/20"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold border border-primary/20">
                          You
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                      IS
                    </div>
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-secondary rounded-bl-none border border-primary/20">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-primary/10 p-4 bg-card">
            <form onSubmit={handleSubmit} className="flex w-full gap-3">
              <Input
                placeholder="Ask anything about our services, mental wellness, or booking..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                className="rounded-full border-primary/20 focus:border-primary"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all text-white font-semibold px-6"
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
