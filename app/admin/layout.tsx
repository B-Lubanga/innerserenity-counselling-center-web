"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, BarChart3, Users, Settings, Calendar, FileText } from "lucide-react"
import Logo from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else if (token) {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background" />
  }

  if (!isLoggedIn && pathname !== "/admin/login") {
    return <>{children}</>
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="hidden sm:inline text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <Link href="/admin/dashboard">
                <Button
                  variant={pathname === "/admin/dashboard" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-lg"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/calendar">
                <Button
                  variant={pathname === "/admin/calendar" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-lg"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </Link>
              <Link href="/admin/clients">
                <Button
                  variant={pathname === "/admin/clients" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-lg"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Clients
                </Button>
              </Link>
              <Link href="/admin/invoices">
                <Button
                  variant={pathname === "/admin/invoices" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Invoices
                </Button>
              </Link>
            </div>

            <ModeToggle />

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-lg border-destructive/30 hover:border-destructive text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
