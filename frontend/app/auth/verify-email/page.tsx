"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, AlertTriangle, Mail } from "lucide-react"
import { toast } from "sonner"

function VerifyEmailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (!tokenFromUrl) {
      setError("Invalid verification link. Please check your email and try again.")
      setIsLoading(false)
      return
    }

    setToken(tokenFromUrl)
    verifyEmail(tokenFromUrl)
  }, [searchParams])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: verificationToken
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success("Email verified successfully!", {
          description: "Your account is now active.",
          duration: 4000,
        })
      } else {
        setError(data.detail || "Failed to verify email")
      }
    } catch (error) {
      setError("An error occurred while verifying your email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-fern rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-ivory animate-pulse" />
            </div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    )
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
              Email Verified!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your Inner Serenity account has been successfully verified.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You can now sign in to your account and book your first counselling session.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-fern hover:bg-fern/90 text-ivory"
                >
                  Sign In to Your Account
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push("/booking")}
                  className="w-full"
                >
                  Book a Session
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Welcome to Inner Serenity Counselling Centre! 🌿
              </p>
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
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-heading text-fern">
            Verification Failed
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We couldn't verify your email address.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This could happen if:
            </p>
            <ul className="text-sm text-muted-foreground text-left space-y-1">
              <li>• The verification link has expired</li>
              <li>• The link has already been used</li>
              <li>• The link is invalid or corrupted</li>
            </ul>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-fern hover:bg-fern/90 text-ivory"
              >
                Go to Sign In
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/auth/forgot-password")}
                className="w-full"
              >
                Request New Verification
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              If you continue to have issues, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apricot"></div>
    </div>}>
      <VerifyEmailPageContent />
    </Suspense>
  )
}
