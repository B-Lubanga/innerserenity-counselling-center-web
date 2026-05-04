// Local curated quotes for Inner Serenity Counselling Centre
// No external API dependencies - always available

export interface Quote {
  content: string
  author: string
  tags: string[]
}

// Curated wellness and mental health quotes
const WELLNESS_QUOTES: Quote[] = [
  {
    content: "Vulnerability is not winning or losing; it's having the courage to show up and be seen when we have no control over the outcome.",
    author: "Brené Brown",
    tags: ["vulnerability", "courage", "authenticity"]
  },
  {
    content: "Owning our story and loving ourselves through that process is the bravest thing that we'll ever do.",
    author: "Brené Brown",
    tags: ["self-acceptance", "healing", "courage"]
  },
  {
    content: "The privilege of a lifetime is being who you are.",
    author: "Joseph Campbell",
    tags: ["authenticity", "self-discovery", "purpose"]
  },
  {
    content: "Your visions will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes.",
    author: "Carl Jung",
    tags: ["self-awareness", "introspection", "awakening"]
  },
  {
    content: "I am not what happened to me, I am what I choose to become.",
    author: "Carl Jung",
    tags: ["resilience", "choice", "empowerment"]
  },
  {
    content: "Everything that irritates us about others can lead us to an understanding of ourselves.",
    author: "Carl Jung",
    tags: ["self-reflection", "understanding", "growth"]
  },
  {
    content: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor Frankl",
    tags: ["resilience", "adaptation", "meaning"]
  },
  {
    content: "Those who have a 'why' to live, can bear with almost any 'how'.",
    author: "Viktor Frankl",
    tags: ["purpose", "meaning", "resilience"]
  },
  {
    content: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.",
    author: "Viktor Frankl",
    tags: ["mindfulness", "choice", "freedom"]
  },
  {
    content: "My mission in life is not merely to survive, but to thrive; and to do so with some passion, some compassion, some humor, and some style.",
    author: "Maya Angelou",
    tags: ["thriving", "passion", "compassion"]
  },
  {
    content: "There is no greater agony than bearing an untold story inside you.",
    author: "Maya Angelou",
    tags: ["expression", "healing", "authenticity"]
  },
  {
    content: "You may not control all the events that happen to you, but you can decide not to be reduced by them.",
    author: "Maya Angelou",
    tags: ["resilience", "empowerment", "choice"]
  },
  {
    content: "Let the beauty of what you love be what you do.",
    author: "Rumi",
    tags: ["passion", "purpose", "beauty"]
  },
  {
    content: "The wound is the place where the Light enters you.",
    author: "Rumi",
    tags: ["healing", "growth", "transformation"]
  },
  {
    content: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
    author: "Rumi",
    tags: ["self-awareness", "love", "barriers"]
  },
  {
    content: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
    tags: ["mindfulness", "breathing", "presence"]
  },
  {
    content: "The present moment is the only moment available to us, and it is the door to all moments.",
    author: "Thich Nhat Hanh",
    tags: ["mindfulness", "presence", "awareness"]
  },
  {
    content: "Smile, breathe and go slowly.",
    author: "Thich Nhat Hanh",
    tags: ["mindfulness", "simplicity", "peace"]
  },
  {
    content: "The mind is everything. What you think you become.",
    author: "Buddha",
    tags: ["mindset", "thoughts", "transformation"]
  },
  {
    content: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    tags: ["inner-peace", "mindfulness", "self-discovery"]
  }
]

export function getRandomQuote(tags?: string[]): Quote {
  let filteredQuotes = WELLNESS_QUOTES
  
  // Filter by tags if provided
  if (tags && tags.length > 0) {
    filteredQuotes = WELLNESS_QUOTES.filter(quote => 
      quote.tags.some(tag => tags.includes(tag))
    )
  }
  
  // If no quotes match the tags, use all quotes
  if (filteredQuotes.length === 0) {
    filteredQuotes = WELLNESS_QUOTES
  }
  
  // Return random quote from filtered list
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length)
  return filteredQuotes[randomIndex]
}

export function getRandomQuotes(count: number = 10, tags?: string[]): Quote[] {
  const quotes: Quote[] = []
  const availableQuotes = tags ? 
    WELLNESS_QUOTES.filter(quote => 
      quote.tags.some(tag => tags.includes(tag))
    ) : WELLNESS_QUOTES
  
  // If no quotes match tags, use all quotes
  const sourceQuotes = availableQuotes.length > 0 ? availableQuotes : WELLNESS_QUOTES
  
  // Get random quotes without duplicates
  const indices = new Set<number>()
  while (indices.size < Math.min(count, sourceQuotes.length)) {
    indices.add(Math.floor(Math.random() * sourceQuotes.length))
  }
  
  indices.forEach(index => {
    quotes.push(sourceQuotes[index])
  })
  
  return quotes
}
