"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageCircle, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import Logo from "./logo"
import { NAV_LINKS } from "@/lib/constants"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="bg-gradient-to-r from-card via-card to-card border-b border-primary/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity group">
              <Logo />
              <span className="ml-2 hidden sm:inline text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Inner Serenity
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Chat Button */}
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all text-white font-semibold ml-2"
            >
              <Link href="/chat">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Link>
            </Button>

            {/* Theme & Admin */}
            <div className="flex items-center gap-1 ml-1 pl-1 border-l border-primary/20">
              <ModeToggle />
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-primary hover:bg-primary/10"
                title="Admin Login"
              >
                <Link href="/admin/login">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              asChild
              size="icon"
              className="rounded-full bg-accent hover:bg-accent/90 text-white"
            >
              <Link href="/chat">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </Button>
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3">
              <Button variant="default" className="flex-1 rounded-full" asChild onClick={closeMenu}>
                <Link href="/chat">Chat</Link>
              </Button>
              <Button variant="outline" className="flex-1 rounded-full" asChild onClick={closeMenu}>
                <Link href="/admin/login">Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
