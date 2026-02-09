"use client"

import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard, Users, ClipboardList, BookOpen, Bell, BarChart3, Settings,
  Camera, FileText, Calendar, Send, ScanFace, User, LogOut, Fingerprint,
  Building2, CalendarDays, ShieldCheck,
  CalendarCheck,
} from "lucide-react"

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "overview" },
  { label: "User Management", icon: Users, id: "users" },
  { label: "Face Recognition", icon: ScanFace, id: "face-recognition" },
  { label: "Faculty Verification", icon: ShieldCheck, id: "faculty-attendance" },
  { label: "Faculty Attendance", icon: CalendarCheck, id: "faculty-attendance-record" },
  { label: "Student Attendance", icon: ClipboardList, id: "attendance" },
  { label: "Departments", icon: Building2, id: "departments" },
  { label: "Academic Sessions", icon: CalendarDays, id: "sessions" },
  { label: "Notifications", icon: Bell, id: "notifications" },
  { label: "Reports & Analytics", icon: BarChart3, id: "reports" },
  { label: "Settings", icon: Settings, id: "settings" },
]

const facultyNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "overview" },
  { label: "My Attendance", icon: Fingerprint, id: "my-attendance" },
  { label: "Mark Class Attendance", icon: Camera, id: "attendance-camera" },
  { label: "Class Records", icon: ClipboardList, id: "attendance" },
  { label: "Assignments", icon: FileText, id: "assignments" },
  { label: "Exam Schedules", icon: Calendar, id: "exams" },
  { label: "Send Notification", icon: Send, id: "notifications" },
]

const studentNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "overview" },
  { label: "Mark Attendance", icon: Fingerprint, id: "mark-attendance" },
  { label: "My Attendance", icon: ClipboardList, id: "attendance" },
  { label: "Assignments", icon: FileText, id: "assignments" },
  { label: "Exam Schedule", icon: Calendar, id: "exams" },
  { label: "Notifications", icon: Bell, id: "notifications" },
  { label: "Profile", icon: User, id: "profile" },
]

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { user, logout } = useAuth()
  if (!user) return null

  const navItems =
    user.role === "admin"
      ? adminNavItems
      : user.role === "faculty"
        ? facultyNavItems
        : studentNavItems

  const roleLabel = user.role === "admin" ? "Administrator" : user.role === "faculty" ? "Faculty" : "Student"

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <ScanFace className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">AttendAI</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabel} Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
