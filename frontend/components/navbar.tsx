"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageCircle, LayoutDashboard, User, LogOut, Calendar, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import Logo from "./logo"
import { NAV_LINKS } from "@/lib/constants"
import { useAuth } from "@/components/auth-provider"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  const isActive = (href: string): boolean => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const closeMenu = () => setIsMenuOpen(false)

  const getUserInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <nav className="bg-fern border-b border-fern-light sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity group">
              <Logo />
              <span className="ml-2 hidden sm:inline text-sm font-bold font-heading text-ivory group-hover:scale-105 transition-transform">
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
                    ? "bg-apricot/20 text-apricot font-semibold"
                    : "text-ivory hover:bg-apricot/10 hover:text-apricot"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth buttons or user menu */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <>
                    {/* Chat Button */}
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-apricot hover:bg-apricot/90 text-ivory font-semibold ml-2"
                    >
                      <Link href="/chat">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Link>
                    </Button>

                    {/* User Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full ml-2"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={user.first_name} />
                            <AvatarFallback className="bg-apricot text-ivory text-sm font-semibold">
                              {getUserInitials(user.first_name, user.last_name)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/booking" className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            My Bookings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center">
                            <UserCircle className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    {/* Book a Session Button */}
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-apricot hover:bg-apricot/90 text-ivory font-semibold ml-2"
                    >
                      <Link href="/booking">
                        Book a Session
                      </Link>
                    </Button>

                    {/* Sign In Button */}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full border-apricot text-apricot hover:bg-apricot hover:text-ivory ml-2"
                    >
                      <Link href="/auth/login">
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}

                {/* Theme & Admin */}
                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-fern-light">
                  <ModeToggle />
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-ivory hover:bg-apricot/10 hover:text-apricot"
                    title="Admin Login"
                  >
                    <Link href="/admin/login">
                      <LayoutDashboard className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {/* Show chat button if authenticated */}
            {!isLoading && isAuthenticated && (
              <Button
                asChild
                size="icon"
                className="rounded-full bg-apricot hover:bg-apricot/90 text-ivory"
              >
                <Link href="/chat">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-ivory hover:bg-apricot/10 focus:outline-none focus:ring-2 focus:ring-apricot"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-fern-light">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-fern">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-apricot/20 text-apricot font-semibold"
                    : "text-ivory hover:bg-apricot/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile auth buttons */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <>
                    <div className="border-t border-fern-light pt-3 mt-3">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-ivory">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-ivory/70 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/booking"
                      onClick={closeMenu}
                      className="block px-3 py-2 rounded-md text-base font-medium text-ivory hover:bg-apricot/10"
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="block px-3 py-2 rounded-md text-base font-medium text-ivory hover:bg-apricot/10"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        closeMenu()
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-ivory hover:bg-apricot/10"
                    >
                      Sign Out
                    </button>
                    <div className="flex gap-2 mt-3">
                      <Button className="flex-1 rounded-full bg-apricot hover:bg-apricot/90 text-ivory" asChild onClick={closeMenu}>
                        <Link href="/chat">Chat</Link>
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-full border-apricot text-apricot hover:bg-apricot hover:text-ivory" asChild onClick={closeMenu}>
                        <Link href="/admin/login">Admin</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <Button className="flex-1 rounded-full bg-apricot hover:bg-apricot/90 text-ivory" asChild onClick={closeMenu}>
                      <Link href="/booking">Book Session</Link>
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full border-apricot text-apricot hover:bg-apricot hover:text-ivory" asChild onClick={closeMenu}>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
