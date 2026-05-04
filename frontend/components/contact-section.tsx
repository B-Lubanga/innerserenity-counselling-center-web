import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need more information? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="Enquiry – Inner Serenity Counselling Centre" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Your message" rows={5} />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          <div className="lg:pl-12">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  {/* TODO: Update address */}
                  <p className="text-muted-foreground mt-1">
                    123 Healing Street
                    <br />
                    Wellness District
                    <br />
                    Serenity City, SC 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  {/* TODO: Update phone number */}
                  <p className="text-muted-foreground mt-1">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-muted-foreground mt-1">support@innerserenity.com</p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium mb-3">Hours of Operation</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Monday - Friday</div>
                  <div>10:00 AM - 7:00 PM</div>
                  <div>Saturday</div>
                  <div>Closed</div>
                  <div>Sunday</div>
                  <div>Closed</div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  We are closed on weekends. For urgent support outside office hours, please contact a crisis helpline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
