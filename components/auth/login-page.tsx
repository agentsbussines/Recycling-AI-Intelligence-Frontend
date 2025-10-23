"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

interface LoginPageProps {
  onLoginSuccess: (success: boolean) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const validUsername = process.env.NEXT_PUBLIC_LOGIN_USERNAME || "admin"
      const validPassword = process.env.NEXT_PUBLIC_LOGIN_PASSWORD || "password"

      if (username === validUsername && password === validPassword) {
        // Store auth token in localStorage
        localStorage.setItem("auth_token", "authenticated")
        onLoginSuccess(true)
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="relative w-20 h-20">
              <Image src="/brand-image.png" alt="Recicladora Industrial" fill className="object-contain" priority />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-2">Recicladora Industrial</h1>
          <p className="text-green-700 font-semibold mb-1">Recycling Intelligence System</p>
          <p className="text-green-600 text-sm">Advanced AI-Powered Analytics & Management</p>
        </div>

        <Card className="border-green-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-900">Sign In</CardTitle>
            <CardDescription className="text-green-700">Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-900">Username</label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-900">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-green-50 border-green-200 text-green-900 placeholder:text-green-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 mb-2 font-semibold">Demo Credentials:</p>
              <p className="text-xs text-green-800">
                Username: <span className="font-mono">admin</span>
              </p>
              <p className="text-xs text-green-800">
                Password: <span className="font-mono">password</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-green-600 mt-6">© 2025 Recicladora Industrial. All rights reserved.</p>
      </div>
    </div>
  )
}
