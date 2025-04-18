"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (index: number, value: string) => {
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

  const handleVerify = () => {
    const fullCode = code.join("")
    if (fullCode.length === 6) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        setIsVerified(true)
      }, 1500)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            {isVerified
              ? "Your email has been successfully verified!"
              : "Enter the 6-digit code sent to your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerified ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <p className="text-center">Your account is now active. You can now sign in to your account.</p>
            </div>
          ) : (
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
                    onChange={(e) => handleChange(index, e.target.value)}
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {isVerified ? (
            <Button className="w-full" asChild>
              <Link href="/sign-in">Continue to Sign In</Link>
            </Button>
          ) : (
            <Button className="w-full" onClick={handleVerify} disabled={code.join("").length !== 6 || isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
