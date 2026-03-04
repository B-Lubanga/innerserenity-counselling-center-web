// Advanced chat system for handling multiple inquiry types
export type InquiryType = "service" | "faq" | "wellness" | "customer_service" | "booking" | "general"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  type: InquiryType
  timestamp: Date
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  inquiryType: InquiryType
  startedAt: Date
  escalated: boolean
  summary?: string
}

// Service knowledge base
export const SERVICE_KNOWLEDGE_BASE = {
  services: [
    {
      name: "Individual Therapy",
      description: "One-on-one counselling for personal growth and mental health",
      duration: "50-60 minutes",
      price: "$100-150",
      focus: ["anxiety", "depression", "stress", "personal growth"],
    },
    {
      name: "Couples Therapy",
      description: "Relationship counselling for couples facing challenges",
      duration: "50-60 minutes",
      price: "$150-200",
      focus: ["relationship issues", "communication", "conflict resolution"],
    },
    {
      name: "Family Therapy",
      description: "Group sessions for family dynamics and relationships",
      duration: "60-90 minutes",
      price: "$150-250",
      focus: ["family issues", "parenting", "dynamics"],
    },
    {
      name: "Group Sessions",
      description: "Supportive group therapy for shared experiences",
      duration: "90 minutes",
      price: "$30-50",
      focus: ["support", "community", "shared experiences"],
    },
    {
      name: "Crisis Support",
      description: "Immediate counselling for acute emotional distress",
      duration: "30-50 minutes",
      price: "Sliding scale",
      focus: ["emergency", "acute stress", "crisis"],
    },
  ],
  faqs: [
    {
      question: "How do I book a session?",
      answer: "You can book directly on our website using the booking calendar. Select your preferred date and time, and you'll receive a confirmation email.",
    },
    {
      question: "Are sessions confidential?",
      answer: "Yes, all sessions are completely confidential under professional ethics standards. We maintain strict privacy policies.",
    },
    {
      question: "What if I need to cancel?",
      answer: "Please notify us at least 24 hours before your appointment for a full refund or rescheduling.",
    },
    {
      question: "Do you offer virtual sessions?",
      answer: "Yes, we offer both in-person and virtual sessions via secure video conferencing.",
    },
    {
      question: "What insurance do you accept?",
      answer: "Please contact us for insurance verification. We work with most major plans.",
    },
  ],
  wellness_tips: [
    {
      topic: "Mindfulness",
      tips: ["Start with 5-minute daily meditation", "Practice deep breathing exercises", "Try body scan relaxation"],
    },
    {
      topic: "Sleep",
      tips: ["Maintain consistent sleep schedule", "Avoid screens 1 hour before bed", "Create a calm bedroom environment"],
    },
    {
      topic: "Stress Management",
      tips: ["Take regular breaks", "Exercise regularly", "Practice journaling", "Connect with loved ones"],
    },
    {
      topic: "Anxiety",
      tips: ["Grounding techniques (5-4-3-2-1 method)", "Progressive muscle relaxation", "Breathing exercises"],
    },
  ],
}

// Determine inquiry type from user message
export function determineInquiryType(message: string): InquiryType {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("book") || lowerMessage.includes("appointment") || lowerMessage.includes("session")) {
    return "booking"
  }
  if (lowerMessage.includes("service") || lowerMessage.includes("therapy") || lowerMessage.includes("counselling")) {
    return "service"
  }
  if (lowerMessage.includes("how") || lowerMessage.includes("what") || lowerMessage.includes("when") || lowerMessage.includes("?")) {
    return "faq"
  }
  if (lowerMessage.includes("mental health") || lowerMessage.includes("wellness") || lowerMessage.includes("meditation") || lowerMessage.includes("stress")) {
    return "wellness"
  }
  if (lowerMessage.includes("problem") || lowerMessage.includes("issue") || lowerMessage.includes("complaint") || lowerMessage.includes("urgent")) {
    return "customer_service"
  }

  return "general"
}

// Generate system prompt based on inquiry type
export function getSystemPrompt(type: InquiryType): string {
  const basePrompt = "You are Inner Serenity Counselling Centre's AI assistant. You are helpful, empathetic, and professional."

  switch (type) {
    case "service":
      return (
        basePrompt +
        ` You are an expert on our counselling services. Be thorough in explaining services, duration, and approaches.`
      )
    case "wellness":
      return (
        basePrompt +
        ` You provide mental wellness advice and mental health tips. Always encourage professional help for serious issues.`
      )
    case "booking":
      return basePrompt + ` Help users with booking sessions, explain our availability system, and guide them through the process.`
    case "customer_service":
      return basePrompt + ` Address customer concerns professionally. If you cannot resolve an issue, summarize it for escalation.`
    case "faq":
      return basePrompt + ` Answer frequently asked questions about our services, policies, and processes.`
    default:
      return basePrompt + ` Provide helpful information about Inner Serenity Counselling Centre and mental health support.`
  }
}

// Generate response summary for escalation
export function generateEscalationSummary(messages: ChatMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content)
  const mainTopics = messages.slice(-5).map((m) => m.type)
  const primaryConcern = mainTopics[0] || "general inquiry"

  return `Customer Inquiry - ${primaryConcern.toUpperCase()}\n\nKey Messages:\n${userMessages.map((msg, i) => `${i + 1}. ${msg}`).join("\n")}\n\nNeeds human support for detailed assistance.`
}

export function shouldEscalate(message: string, conversationLength: number): boolean {
  const escalationTriggers = [
    "escalate",
    "speak to someone",
    "human",
    "manager",
    "urgent",
    "emergency",
    "crisis",
    "complaint",
  ]

  return (
    escalationTriggers.some((trigger) => message.toLowerCase().includes(trigger)) || conversationLength > 10
  )
}
