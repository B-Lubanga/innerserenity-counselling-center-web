import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function BookingCTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Calendar className="h-16 w-16 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take the First Step?</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Our counsellors are here to support you. Book a session today and begin your journey toward healing and
          growth.
        </p>
        <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 rounded-full" asChild>
          <Link href="/booking">Book Your Session</Link>
        </Button>
      </div>
    </section>
  )
}
