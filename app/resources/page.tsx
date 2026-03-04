"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, BookOpen, Video, FileText, Heart, Brain } from "lucide-react"
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "@/components/animated-scroll"

export const metadata = {
  title: "Resources - Inner Serenity Counselling Centre",
  description: "Free mental health resources, guides, and educational materials to support your wellbeing",
}

const resources = [
  {
    id: 1,
    title: "Understanding Anxiety: A Complete Guide",
    type: "Guide",
    icon: Brain,
    description: "Learn about anxiety disorders, their symptoms, and evidence-based treatment approaches.",
    category: "Mental Health",
    downloads: 1250,
  },
  {
    id: 2,
    title: "Stress Management Techniques",
    type: "Workbook",
    icon: FileText,
    description: "Practical exercises and techniques to manage daily stress and build resilience.",
    category: "Stress Management",
    downloads: 890,
  },
  {
    id: 3,
    title: "Mindfulness for Beginners",
    type: "Video Series",
    icon: Video,
    description: "Introduction to mindfulness meditation with step-by-step guidance for beginners.",
    category: "Mindfulness",
    downloads: 2100,
  },
  {
    id: 4,
    title: "Building Healthy Relationships",
    type: "Guide",
    icon: Heart,
    description: "Insights and practical advice for developing and maintaining healthy relationships.",
    category: "Relationships",
    downloads: 1520,
  },
  {
    id: 5,
    title: "Cognitive Behavioral Therapy Workbook",
    type: "Workbook",
    icon: FileText,
    description: "Self-guided CBT exercises to identify and change unhelpful thought patterns.",
    category: "Therapy",
    downloads: 2350,
  },
  {
    id: 6,
    title: "Sleep Hygiene & Better Rest",
    type: "Guide",
    icon: BookOpen,
    description: "Evidence-based strategies for improving sleep quality and managing insomnia.",
    category: "Wellness",
    downloads: 1840,
  },
]

const videos = [
  {
    id: 1,
    title: "10-Minute Mindfulness Meditation for Beginners",
    channel: "Mindful Moments",
    description: "A simple guided meditation to help you get started with mindfulness practice.",
    url: "https://www.youtube.com/embed/U9YKP7ZZesQ",
  },
  {
    id: 2,
    title: "What is Counselling and How Can It Help?",
    channel: "Mental Health Foundation",
    description: "Understanding the basics of counselling therapy and its benefits for mental wellness.",
    url: "https://www.youtube.com/embed/gvHwP0a5yAE",
  },
  {
    id: 3,
    title: "5-Minute Anxiety Relief Breathing Technique",
    channel: "Calm Coach",
    description: "Learn a quick breathing technique to manage anxiety and stress in the moment.",
    url: "https://www.youtube.com/embed/tybOi4hjZFY",
  },
  {
    id: 4,
    title: "The Power of Self-Compassion in Healing",
    channel: "Psychology Insights",
    description: "Discover how self-compassion can transform your mental health journey.",
    url: "https://www.youtube.com/embed/IvtZBUSplr4",
  },
]

const articles = [
  {
    id: 1,
    title: "The Connection Between Exercise and Mental Health",
    excerpt: "Discover how physical activity can significantly improve your mental wellbeing and reduce stress.",
    date: "March 1, 2024",
    author: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Understanding Depression: Signs and Support",
    excerpt: "Learn about depression symptoms and when to seek professional help.",
    date: "February 28, 2024",
    author: "Emily Rodriguez",
  },
  {
    id: 3,
    title: "Navigating Life Transitions with Confidence",
    excerpt: "Practical strategies for managing change and building resilience during challenging times.",
    date: "February 25, 2024",
    author: "Michael Chen",
  },
  {
    id: 4,
    title: "The Power of Gratitude Practice",
    excerpt: "How practicing gratitude can transform your perspective and improve overall mental health.",
    date: "February 20, 2024",
    author: "David Lee",
  },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Mental Health Resources</h1>
          <p className="text-xl text-muted-foreground">
            Free, evidence-based resources to support your mental health journey. Explore guides, workbooks, videos, and
            articles curated by our expert team.
          </p>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Downloadable Resources</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="mb-4 flex-grow">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{resource.category}</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-xs text-muted-foreground">{resource.downloads} downloads</span>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Curated YouTube Videos */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Mindfulness & Counselling Videos</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col rounded-lg overflow-hidden border border-primary/10 hover:border-primary/30 transition-colors">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-card flex-grow flex flex-col">
                  <h3 className="font-semibold text-foreground mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">{video.description}</p>
                  <p className="text-xs text-primary font-medium">{video.channel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>

          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <CardDescription className="text-base">{article.excerpt}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>By {article.author}</p>
                      <p>{article.date}</p>
                    </div>
                    <Button variant="outline" className="rounded-full">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Help Tools */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Self-Help Tools</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Mood Tracker",
                description: "Track your emotional wellbeing daily and identify patterns over time.",
                features: ["Daily logging", "Visual charts", "Trend analysis"],
              },
              {
                title: "Gratitude Journal",
                description: "Cultivate gratitude with daily reflection prompts and journaling exercises.",
                features: ["Daily prompts", "Private journal", "Progress tracking"],
              },
              {
                title: "Stress Assessment",
                description: "Evaluate your stress levels and receive personalized recommendations.",
                features: ["Quick assessment", "Results analysis", "Action plan"],
              },
              {
                title: "Breathing Exercises",
                description: "Guided breathing techniques to calm anxiety and manage stress.",
                features: ["Multiple techniques", "Guided audio", "Timer included"],
              },
            ].map((tool, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full rounded-full">Start Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need More Support?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            While these resources are valuable, professional support can make a significant difference in your mental health
            journey.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <a href="/booking">Schedule a Consultation</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
