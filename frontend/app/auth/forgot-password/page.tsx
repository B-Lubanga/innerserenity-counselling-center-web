"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success("Reset instructions sent", {
          description: "Check your email for password reset instructions.",
          duration: 5000,
        })
      } else {
        setError(data.detail || "Failed to send reset instructions")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-heading text-fern">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              If that email is registered, you'll receive reset instructions shortly.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                We've sent password reset instructions to:
              </p>
              <p className="font-medium text-foreground">{formData.email}</p>
              <p className="text-sm text-muted-foreground">
                The link will expire in 2 hours.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-fern hover:bg-fern/90 text-ivory"
              >
                Back to Sign In
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false)
                  setFormData({ email: "" })
                }}
                className="w-full"
              >
                Try Another Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-fern rounded-full flex items-center justify-center">
            <span className="text-ivory font-bold text-2xl font-heading">IS</span>
          </div>
          <CardTitle className="text-2xl font-heading text-fern">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-fern hover:bg-fern/90 text-ivory"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link
              href="/auth/login"
              className="text-sm text-apricot hover:underline"
            >
              Back to Sign In
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-apricot hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
