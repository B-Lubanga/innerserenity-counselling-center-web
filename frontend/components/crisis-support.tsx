import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, AlertTriangle } from "lucide-react"

export default function CrisisSupport() {
  return (
    <section className="py-16 bg-error/10 dark:bg-error/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-error/30 dark:border-error/60 bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-error" />
            </div>
            <CardTitle className="text-2xl text-error dark:text-error-light">Crisis Support</CardTitle>
            <CardDescription className="text-base">
              If you're experiencing a mental health crisis, immediate help is available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-error/30 dark:border-error/60">
                <CardContent className="p-4 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-error" />
                  <h3 className="font-semibold mb-2">24/7 Crisis Hotline</h3>
                  <p className="text-2xl font-bold text-error mb-2">988</p>
                  <p className="text-sm text-muted-foreground">Suicide & Crisis Lifeline</p>
                </CardContent>
              </Card>
              <Card className="border-error/30 dark:border-error/60">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-error" />
                  <h3 className="font-semibold mb-2">Crisis Text Line</h3>
                  <p className="text-lg font-bold text-error mb-2">Text HOME to 741741</p>
                  <p className="text-sm text-muted-foreground">24/7 text support</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Emergency:</strong> If you're in immediate danger, call 911 or go to your nearest emergency
                room.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-error/30 text-error hover:bg-error/10 rounded-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Crisis Line
                </Button>
                <Button variant="outline" className="border-error/30 text-error hover:bg-error/10 rounded-full" asChild>
                  <a href="/chat">Chat with Support</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
