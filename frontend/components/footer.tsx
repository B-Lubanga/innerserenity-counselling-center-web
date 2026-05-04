import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Logo from "./logo"

export default function Footer() {
  return (
    <footer className="bg-fern text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-ivory/80 font-body">
              Professional counselling services to help you discover peace and balance in your life.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-ivory/60 hover:text-apricot transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-ivory/60 hover:text-apricot transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-ivory/60 hover:text-apricot transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-ivory/60 hover:text-apricot transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Book a Session
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/individual"
                  className="text-ivory/60 hover:text-apricot transition-colors font-body"
                >
                  Individual Therapy
                </Link>
              </li>
              <li>
                <Link href="/services/couples" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Couples Counselling
                </Link>
              </li>
              <li>
                <Link href="/services/family" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Family Therapy
                </Link>
              </li>
              <li>
                <Link href="/services/cbt" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Cognitive Behavioral Therapy
                </Link>
              </li>
              <li>
                <Link
                  href="/services/mindfulness"
                  className="text-ivory/60 hover:text-apricot transition-colors font-body"
                >
                  Mindfulness Practices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-ivory/60 hover:text-apricot transition-colors font-body">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-fern-light mt-12 pt-8 text-center text-sm text-ivory/60 font-body">
          <p>&copy; {new Date().getFullYear()} Inner Serenity Counselling Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
