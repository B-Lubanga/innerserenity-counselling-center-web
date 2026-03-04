"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Save,
  Send,
  Clock,
  User,
  FileText,
  Zap,
} from "lucide-react"

export default function SessionInterface() {
  const [isRecording, setIsRecording] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [sessionNotes, setSessionNotes] = useState("")
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [newKeyPoint, setNewKeyPoint] = useState("")
  const [newRecommendation, setNewRecommendation] = useState("")
  const [elapsedTime, setElapsedTime] = useState("00:45")

  const addKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setKeyPoints([...keyPoints, newKeyPoint])
      setNewKeyPoint("")
    }
  }

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setRecommendations([...recommendations, newRecommendation])
      setNewRecommendation("")
    }
  }

  const removeKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index))
  }

  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="border-b border-primary/10 bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Active Session</h1>
            <p className="text-sm text-muted-foreground">Live Counselling Session Interface</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Session Duration</p>
              <p className="text-2xl font-bold text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {elapsedTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video/Call Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/10 overflow-hidden">
              <div className="bg-black relative aspect-video rounded-lg overflow-hidden">
                {/* Placeholder for video feed */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Client Video Feed</p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <Button
                    size="lg"
                    variant={videoEnabled ? "default" : "destructive"}
                    className="rounded-full"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? (
                      <>
                        <Video className="h-5 w-5 mr-2" />
                        Video On
                      </>
                    ) : (
                      <>
                        <VideoOff className="h-5 w-5 mr-2" />
                        Video Off
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className="rounded-full"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-5 w-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Session Notes Section */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Session Notes
                </CardTitle>
                <CardDescription>Take notes during the session for future reference</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your session notes here. Capture key discussion points, client observations, and important details..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="min-h-40 resize-none"
                />
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                  <Button variant="outline" className="rounded-lg">
                    <Zap className="h-4 w-4 mr-2" />
                    AI Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Client Info & Session Details */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client Name</p>
                  <p className="font-semibold text-foreground">Sarah Johnson</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">sarah@example.com</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">(555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Session Type</p>
                  <Badge className="mt-1 bg-primary/20 text-primary">Individual Therapy</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Previous Sessions</p>
                  <p className="font-semibold text-foreground">8 sessions</p>
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-base">Key Points Discussed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add key point..."
                    value={newKeyPoint}
                    onChange={(e) => setNewKeyPoint(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyPoint()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={addKeyPoint} className="rounded-lg bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-secondary/50 rounded border border-primary/10">
                      <p className="text-sm text-foreground">{point}</p>
                      <button
                        onClick={() => removeKeyPoint(index)}
                        className="text-muted-foreground hover:text-destructive text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-base">Recommendations & Follow-up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add recommendation..."
                    value={newRecommendation}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addRecommendation()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={addRecommendation} className="rounded-lg bg-accent hover:bg-accent/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-secondary/50 rounded border border-accent/10">
                      <p className="text-sm text-foreground">{rec}</p>
                      <button
                        onClick={() => removeRecommendation(index)}
                        className="text-muted-foreground hover:text-destructive text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Summary Button */}
            <Button className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-lg py-6 font-semibold text-base">
              End Session & Generate Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
