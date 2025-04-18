"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

export default function ResetPassword() {
  const [step, setStep] = useState<"code" | "reset" | "success">("code")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("")
      setCode(newCode)

      // Focus the last input
      const lastInput = document.getElementById("code-5")
      if (lastInput) {
        lastInput.focus()
      }
    }
  }

  const handleVerifyCode = () => {
    const fullCode = code.join("")
    if (fullCode.length === 6) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        setStep("reset")
      }, 1500)
    }
  }

  const handleResetPassword = () => {
    if (password && password === confirmPassword) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        setStep("success")
      }, 1500)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {step === "code" && "Enter the 6-digit code sent to your email address"}
            {step === "reset" && "Create a new password for your account"}
            {step === "success" && "Your password has been reset successfully"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "code" && (
            <>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Didn't receive a code?{" "}
                  <Button variant="link" className="p-0 h-auto">
                    Resend
                  </Button>
                </p>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <p className="text-center">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {step === "code" && (
            <Button className="w-full" onClick={handleVerifyCode} disabled={code.join("").length !== 6 || isLoading}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          )}

          {step === "reset" && (
            <Button
              className="w-full"
              onClick={handleResetPassword}
              disabled={!password || password !== confirmPassword || isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          )}

          {step === "success" && (
            <Button className="w-full" asChild>
              <Link href="/sign-in">Continue to Sign In</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
