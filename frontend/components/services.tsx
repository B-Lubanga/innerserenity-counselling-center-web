import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Users, UserPlus, Sparkles, Leaf } from "lucide-react"

const services = [
  {
    title: "Individual Therapy",
    description: "One-on-one sessions tailored to your specific needs and goals.",
    icon: <UserPlus className="h-10 w-10 text-apricot" />,
  },
  {
    title: "Couples Counselling",
    description: "Strengthen your relationship and improve communication with your partner.",
    icon: <Heart className="h-10 w-10 text-apricot" />,
  },
  {
    title: "Family Therapy",
    description: "Resolve conflicts and build stronger family connections.",
    icon: <Users className="h-10 w-10 text-apricot" />,
  },
  {
    title: "Cognitive Behavioral Therapy",
    description: "Change negative thought patterns to improve your mental well-being.",
    icon: <Brain className="h-10 w-10 text-apricot" />,
  },
  {
    title: "Mindfulness Practices",
    description: "Learn techniques to stay present and reduce anxiety.",
    icon: <Sparkles className="h-10 w-10 text-apricot" />,
  },
  {
    title: "Stress Management",
    description: "Develop healthy coping mechanisms for life's challenges.",
    icon: <Leaf className="h-10 w-10 text-apricot" />,
  },
]

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-fern mb-6">Our Counselling Services</h2>
          <p className="text-lg text-fern/70 font-body max-w-3xl mx-auto">
            We offer a range of professional counselling services to support your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-ivory border-l-4 border-fern shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="w-16 h-16 bg-apricot/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {service.icon}
                </div>
                <CardTitle className="text-fern font-heading">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-fern/80 font-body text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
