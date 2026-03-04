// Navigation links
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Book a Session" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const

// Counselling center info
export const CENTER_INFO = {
  name: "Inner Serenity Counselling Centre",
  shortName: "Inner Serenity",
  description: "Professional counselling services to help you discover peace and balance in your life",
  email: "support@innerserenity.com",
  phone: "+1 (555) 123-4567",
  hours: {
    weekday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    closed: "Sundays",
  },
  sessionPrice: 120,
  sessionDuration: 50, // minutes
}

// Services
export const SERVICES = [
  {
    id: "individual",
    name: "Individual Therapy",
    description: "One-on-one counselling tailored to your unique needs and goals",
    icon: "User",
  },
  {
    id: "couples",
    name: "Couples Counselling",
    description: "Strengthen your relationship with professional guidance",
    icon: "Users",
  },
  {
    id: "family",
    name: "Family Therapy",
    description: "Heal family dynamics and improve communication",
    icon: "Home",
  },
  {
    id: "cbt",
    name: "Cognitive Behavioral Therapy",
    description: "Evidence-based treatment for anxiety and depression",
    icon: "Brain",
  },
  {
    id: "mindfulness",
    name: "Mindfulness Practices",
    description: "Learn techniques to reduce stress and increase awareness",
    icon: "Zap",
  },
  {
    id: "stress",
    name: "Stress Management",
    description: "Develop effective coping strategies",
    icon: "Activity",
  },
]

// Crisis support resources
export const CRISIS_RESOURCES = [
  {
    name: "National Crisis Hotline",
    number: "1-800-273-8255",
    available: "24/7",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    available: "24/7",
  },
  {
    name: "Emergency Services",
    number: "911",
    available: "24/7",
  },
]

// Mock availability data
export const MOCK_AVAILABILITY = {
  "2024-01-15": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  "2024-01-16": ["10:00 AM", "1:00 PM", "3:00 PM"],
  "2024-01-17": ["9:00 AM", "12:00 PM", "5:00 PM"],
  "2024-01-18": ["11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"],
  "2024-01-19": ["9:00 AM", "1:00 PM", "3:00 PM"],
}

export const BOOKED_SLOTS = {
  "2024-01-15": ["10:00 AM", "3:00 PM"],
  "2024-01-16": ["9:00 AM", "2:00 PM"],
  "2024-01-17": ["10:00 AM", "1:00 PM"],
}

// Session types
export const SESSION_TYPES = [
  { id: "in-person", label: "In-Person Session", description: "Visit our office" },
  { id: "virtual", label: "Virtual Session", description: "Video call from home" },
] as const

// Inspirational quotes
export const INSPIRATIONAL_QUOTES = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
  },
  {
    text: "Whether you think you can or think you can't, you're right.",
    author: "Henry Ford",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
]

// Date formatting utility
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
