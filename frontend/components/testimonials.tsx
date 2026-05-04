import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    quote:
      "The counselling sessions have been transformative for me. I've gained valuable insights and tools to manage my anxiety.",
    name: "Sarah J.",
    initials: "SJ",
  },
  {
    quote:
      "Our marriage was struggling until we started couples therapy here. The therapist helped us communicate better and rebuild trust.",
    name: "Mark & Lisa",
    initials: "ML",
  },
  {
    quote:
      "I was skeptical about therapy at first, but now I can't imagine my life without these sessions. They've helped me process my grief.",
    name: "David T.",
    initials: "DT",
  },
  {
    quote:
      "The mindfulness techniques I learned have completely changed how I respond to stress. I'm so grateful for this guidance.",
    name: "Emma R.",
    initials: "ER",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Client Testimonials</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people whose lives have been positively impacted by our counselling services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic">"{testimonial.quote}"</blockquote>
              </CardContent>
              <CardFooter className="flex items-center gap-4 pt-2">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
