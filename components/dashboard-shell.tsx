"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminDashboard, adminSectionTitles } from "@/components/dashboards/admin-dashboard"
import { FacultyDashboard, facultySectionTitles } from "@/components/dashboards/faculty-dashboard"
import { StudentDashboard, studentSectionTitles } from "@/components/dashboards/student-dashboard"

export function DashboardShell() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")

  if (!user) return null

  const sectionTitles =
    user.role === "admin"
      ? adminSectionTitles
      : user.role === "faculty"
        ? facultySectionTitles
        : studentSectionTitles

  const title = sectionTitles[activeSection] || "Dashboard"

  return (
    <SidebarProvider>
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <SidebarInset>
        <DashboardHeader title={title} />
        <div className="flex-1 p-4 md:p-6">
          {user.role === "admin" && <AdminDashboard activeSection={activeSection} />}
          {user.role === "faculty" && <FacultyDashboard activeSection={activeSection} />}
          {user.role === "student" && <StudentDashboard activeSection={activeSection} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
