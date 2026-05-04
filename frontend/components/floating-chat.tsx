"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-fern-600 hover:bg-fern-700 shadow-lg z-50 p-0"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-fern-200 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-fern-200 bg-fern-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-fern-600 flex items-center justify-center text-white text-xs font-bold">
                IS
              </div>
              <div>
                <h3 className="font-semibold text-fern-900">Chat Support</h3>
                <p className="text-xs text-fern-600">We typically respond instantly</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full hover:bg-fern-200"
            >
              <X className="h-4 w-4 text-fern-600" />
            </Button>
          </div>

          {/* Chat Content - IFrame to full chat page */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src="/chat"
              className="w-full h-full border-0"
              title="Chat Support"
            />
          </div>
        </div>
      )}
    </>
  )
}
