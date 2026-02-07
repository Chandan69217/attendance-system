"use client"

import { useState } from "react"
import { ThemeProvider } from "@/lib/theme-context"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { AppStateProvider } from "@/lib/app-state"
import { LandingPage } from "@/components/landing-page"
import { LoginForm } from "@/components/login-form"
import { DashboardShell } from "@/components/dashboard-shell"
import { AppToasts } from "@/components/app-toasts"
import type { Role } from "@/lib/types"

function AppContent() {
  const { isAuthenticated, login } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const handleQuickLogin = (role: Role) => {
    const emails: Record<Role, string> = {
      admin: "sarah.wilson@university.edu",
      faculty: "james.carter@university.edu",
      student: "alex.t@student.edu",
    }
    login(emails[role], "demo", role)
  }

  if (isAuthenticated) {
    return <DashboardShell />
  }

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />
  }

  return (

    <LandingPage
      onGetStarted={() => setShowLogin(true)}
      onQuickLogin={handleQuickLogin}
    />
   
  )
}

export default function Page() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStateProvider>
          <AppContent />
          <AppToasts />
        </AppStateProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
