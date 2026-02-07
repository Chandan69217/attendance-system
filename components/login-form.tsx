"use client"

import React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScanFace, ShieldCheck, Lock, Mail, ArrowLeft } from "lucide-react"

interface LoginFormProps {
  onBack?: () => void
}

export function LoginForm({ onBack }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("student")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    const success = login(email, password, role)
    if (!success) {
      setError("Invalid credentials")
    }
  }

  const quickLogin = (quickRole: Role) => {
    const emails: Record<Role, string> = {
      admin: "sarah.wilson@university.edu",
      faculty: "james.carter@university.edu",
      student: "alex.t@student.edu",
    }
    login(emails[quickRole], "demo", quickRole)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <div className="flex w-full max-w-[960px] flex-col items-center gap-8 lg:flex-row lg:gap-16">
        {/* Branding */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 self-start text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          )}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ScanFace className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AttendAI</h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Smart face recognition-based attendance management for modern educational institutions.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Secure biometric authentication</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScanFace className="h-4 w-4 text-accent" />
              <span>Real-time face recognition</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-accent" />
              <span>Role-based access control</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-card-foreground">Sign in to your account</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-card-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-card-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role" className="text-card-foreground">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin / Principal</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="mt-2 w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-3 text-center text-xs text-muted-foreground">Quick demo access</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => quickLogin("admin")}>
                  Admin
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => quickLogin("faculty")}>
                  Faculty
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => quickLogin("student")}>
                  Student
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
