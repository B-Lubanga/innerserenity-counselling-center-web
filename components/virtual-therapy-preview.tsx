"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Mic, MicOff, VideoOff, Settings, Users } from "lucide-react"

export default function VirtualTherapyPreview() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Virtual Therapy Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our secure, professional virtual therapy platform from the comfort of your home
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="bg-secondary/50 border-none shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Virtual Session Room</CardTitle>
                    <CardDescription>Secure & Private</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mock video interface */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10"></div>
                  <div className="text-center z-10">
                    <Users className="h-12 w-12 mx-auto mb-2 text-primary/60" />
                    <p className="text-sm text-muted-foreground">Secure Video Session</p>
                  </div>

                  {/* Mock participant windows */}
                  <div className="absolute top-4 right-4 w-24 h-18 bg-background/80 rounded border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-xs">You</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-24 h-18 bg-background/80 rounded border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-xs">Therapist</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={isMicOn ? "default" : "destructive"}
                    size="icon"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className="rounded-full"
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="icon"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="rounded-full"
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Why Choose Virtual Therapy?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Convenience & Comfort</h4>
                  <p className="text-muted-foreground">Attend sessions from your safe space without travel time</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">HIPAA Compliant</h4>
                  <p className="text-muted-foreground">End-to-end encryption ensures your privacy and security</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Flexible Scheduling</h4>
                  <p className="text-muted-foreground">More appointment slots available for virtual sessions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Same Quality Care</h4>
                  <p className="text-muted-foreground">Research shows virtual therapy is as effective as in-person</p>
                </div>
              </div>
            </div>
            <Button className="rounded-full" asChild>
              <a href="/booking">Try Virtual Therapy</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
