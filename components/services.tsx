import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Users, UserPlus, Sparkles, Leaf } from "lucide-react"

const services = [
  {
    title: "Individual Therapy",
    description: "One-on-one sessions tailored to your specific needs and goals.",
    icon: <UserPlus className="h-10 w-10 text-primary" />,
  },
  {
    title: "Couples Counselling",
    description: "Strengthen your relationship and improve communication with your partner.",
    icon: <Heart className="h-10 w-10 text-primary" />,
  },
  {
    title: "Family Therapy",
    description: "Resolve conflicts and build stronger family connections.",
    icon: <Users className="h-10 w-10 text-primary" />,
  },
  {
    title: "Cognitive Behavioral Therapy",
    description: "Change negative thought patterns to improve your mental well-being.",
    icon: <Brain className="h-10 w-10 text-primary" />,
  },
  {
    title: "Mindfulness Practices",
    description: "Learn techniques to stay present and reduce anxiety.",
    icon: <Sparkles className="h-10 w-10 text-primary" />,
  },
  {
    title: "Stress Management",
    description: "Develop healthy coping mechanisms for life's challenges.",
    icon: <Leaf className="h-10 w-10 text-primary" />,
  },
]

export default function Services() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer a range of professional counselling services to support your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-secondary/50 border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {service.icon}
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
