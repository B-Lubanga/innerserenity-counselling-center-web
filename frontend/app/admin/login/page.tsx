"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock } from "lucide-react"
import Logo from "@/components/logo"

const ADMIN_CREDENTIALS = {
  email: "admin@innerserenity.com",
  password: "admin123",
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem("adminToken", JSON.stringify({ email, timestamp: new Date().toISOString() }))
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader className="text-center border-b border-primary/10">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-3xl">Admin Access</CardTitle>
            <CardDescription>Sign in to your counsellor dashboard</CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@innerserenity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">Demo: admin@innerserenity.com</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Demo: admin123</p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all h-11 font-semibold text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Lock className="h-4 w-4 mr-2 animate-pulse" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Return to{" "}
                <Link href="/" className="text-primary hover:text-accent font-semibold">
                  Home
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong>Email:</strong> admin@innerserenity.com
                </p>
                <p>
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
