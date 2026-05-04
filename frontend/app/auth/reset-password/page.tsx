"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface ResetPasswordFormData {
  new_password: string
  confirm_password: string
}

interface PasswordStrength {
  score: number
  message: string
  color: string
}

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    new_password: "",
    confirm_password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: "",
    color: ""
  })

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (!tokenFromUrl) {
      setError("Invalid reset link. Please request a new password reset.")
      setIsTokenValid(false)
    } else {
      setToken(tokenFromUrl)
      setIsTokenValid(true)
    }
  }, [searchParams])

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    let message = ""
    let color = ""

    if (password.length === 0) {
      return { score: 0, message: "", color: "" }
    }

    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    if (score <= 2) {
      message = "Weak password"
      color = "bg-red-500"
    } else if (score <= 4) {
      message = "Medium strength"
      color = "bg-yellow-500"
    } else {
      message = "Strong password"
      color = "bg-green-500"
    }

    return { score: (score / 6) * 100, message, color }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === "new_password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (passwordStrength.score < 50) {
      setError("Please choose a stronger password")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: formData.new_password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success("Password reset successful!", {
          description: "Please log in with your new password.",
          duration: 4000,
        })
      } else {
        setError(data.detail || "Failed to reset password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Validating reset token...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-heading text-fern">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Please request a new password reset link.
              </p>
              
              <Button
                onClick={() => router.push("/auth/forgot-password")}
                className="w-full bg-fern hover:bg-fern/90 text-ivory"
              >
                Request New Reset Link
              </Button>
              
              <Link
                href="/auth/login"
                className="block text-center text-sm text-apricot hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
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
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                You can now log in with your new password.
              </p>
              
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-fern hover:bg-fern/90 text-ivory"
              >
                Go to Sign In
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your new password below.
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
              <Label htmlFor="new_password" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new_password"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.new_password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.new_password && (
                <div className="space-y-1">
                  <Progress value={passwordStrength.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">{passwordStrength.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-apricot hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apricot"></div>
    </div>}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
