"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smile, Meh, Frown, TrendingUp, Calendar } from "lucide-react"

const moodData = [
  { day: "Mon", mood: 4, color: "bg-success" },
  { day: "Tue", mood: 3, color: "bg-warning" },
  { day: "Wed", mood: 5, color: "bg-success-dark" },
  { day: "Thu", mood: 2, color: "bg-warning-dark" },
  { day: "Fri", mood: 4, color: "bg-success" },
  { day: "Sat", mood: 5, color: "bg-success-dark" },
  { day: "Sun", mood: 3, color: "bg-warning" },
]

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Smile className="h-6 w-6 text-success-dark" />
    if (mood >= 3) return <Meh className="h-6 w-6 text-warning-dark" />
    return <Frown className="h-6 w-6 text-warning" />
  }

  const getMoodLabel = (mood: number) => {
    if (mood >= 4) return "Good"
    if (mood >= 3) return "Okay"
    return "Difficult"
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Track Your Mental Wellness</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor your emotional well-being with our integrated mood tracking tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-background/80 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Mood Overview
              </CardTitle>
              <CardDescription>Your emotional patterns this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-end h-32 bg-secondary/50 rounded-lg p-4">
                  {moodData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-6 rounded-t ${data.color} transition-all hover:opacity-80`}
                        style={{ height: `${data.mood * 16}px` }}
                      ></div>
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded"></div>
                    <span>Good Days: 4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded"></div>
                    <span>Okay Days: 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning-dark rounded"></div>
                    <span>Difficult Days: 1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Log Today's Mood
              </CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    className="aspect-square p-2 rounded-full"
                    onClick={() => setSelectedMood(mood)}
                  >
                    {getMoodIcon(mood)}
                  </Button>
                ))}
              </div>
              <div className="text-center">
                {selectedMood && (
                  <Badge variant="secondary" className="text-sm">
                    Feeling {getMoodLabel(selectedMood)} today
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Recent Insights:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Your mood tends to improve on weekends</p>
                  <p>• Thursday was challenging - consider scheduling check-ins</p>
                  <p>• You've had 4 good days this week - great progress!</p>
                </div>
              </div>
              <Button className="w-full rounded-full" asChild>
                <a href="/booking">Discuss with Therapist</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
