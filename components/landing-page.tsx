"use client"

import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ScanFace, ShieldCheck, BarChart3, Users, Clock, CheckCircle2,
  ArrowRight, GraduationCap, BookOpen, Fingerprint, Moon, Sun,
} from "lucide-react"

const features = [
  { icon: ScanFace, title: "Face Recognition", description: "AI-powered biometric identification marks attendance instantly and accurately." },
  { icon: ShieldCheck, title: "Role-Based Access", description: "Secure dashboards for admins, faculty, and students with granular permissions." },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Comprehensive reports and attendance trends across departments and subjects." },
  { icon: Clock, title: "Self Check-In", description: "Students and faculty can mark their own attendance with verification workflows." },
  { icon: Users, title: "Complete Management", description: "Manage students, faculty, departments, academic sessions, and more from one place." },
  { icon: Fingerprint, title: "Verified Attendance", description: "Faculty attendance is verified by the principal/admin for full accountability." },
]

const stats = [
  { value: "99.2%", label: "Recognition Accuracy" },
  { value: "500+", label: "Institutions" },
  { value: "2M+", label: "Attendance Marked" },
  { value: "< 1s", label: "Detection Speed" },
]

const roleCards = [
  { role: "admin" as const, title: "Administrator", subtitle: "Principal / Admin", description: "Complete system control with user management, faculty attendance verification, reports, and settings.", icon: ShieldCheck, features: ["User Management", "Faculty Verification", "Analytics & Reports", "System Settings"] },
  { role: "faculty" as const, title: "Faculty", subtitle: "Professors & Instructors", description: "Mark class attendance via face recognition, manage assignments, and track your own attendance.", icon: BookOpen, features: ["Class Attendance", "Self Check-In", "Assignments & Exams", "Send Notifications"] },
  { role: "student" as const, title: "Student", subtitle: "Enrolled Students", description: "View attendance records, mark self-attendance for classes, and stay updated on assignments.", icon: GraduationCap, features: ["Self Attendance", "View Records", "Assignments", "Exam Schedules"] },
]

interface LandingPageProps {
  onGetStarted: () => void
  onQuickLogin: (role: "admin" | "faculty" | "student") => void
}

export function LandingPage({ onGetStarted, onQuickLogin }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-svh bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ScanFace className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">AttendAI</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Stats</a>
            <a href="#roles" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Roles</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9" aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={onGetStarted} size="sm">
              Sign In
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center lg:px-8 lg:py-32">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Attendance System</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Smart Attendance Management for Modern Institutions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Automate attendance tracking with face recognition technology. Empower administrators, faculty, and students with role-based dashboards and real-time analytics.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onQuickLogin("admin")} className="gap-2 px-8 bg-transparent">
              Try Demo <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center justify-center px-4 py-10 ${i < stats.length - 1 ? "border-r border-border" : ""}`}>
              <span className="text-3xl font-bold text-foreground lg:text-4xl">{stat.value}</span>
              <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything You Need for Attendance Management
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A complete platform that streamlines attendance tracking, academic management, and institutional oversight.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group border-border transition-colors hover:border-primary/30 hover:bg-primary/[0.02]">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Role Cards */}
      <section id="roles" className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dashboards for Every Role
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Each user gets a dedicated interface tailored to their responsibilities and workflow.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {roleCards.map((card) => (
              <Card key={card.role} className="flex flex-col border-border">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 gap-2 bg-transparent" variant="outline" onClick={() => onQuickLogin(card.role)}>
                    Try {card.title} Demo <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <ScanFace className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">AttendAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Face recognition-based attendance management for educational institutions.
          </p>
        </div>
      </footer>
    </div>
  )
}
