"use client"

import { UserManagement } from "./admin/user-management"
import { FacultyAttendanceVerification } from "./admin/faculty-attendance-verification"
import { StudentAttendanceRecord } from "./admin/student-attendance-record"
import { FacultyAttendanceRecord } from "./admin/faculty-attendance-record"
import { FaceRecognition } from "./admin/face-recognition"
import { AdminReports } from "./admin/admin-reports"
import { AdminSettings } from "./admin/admin-settings"
import { AdminNotifications } from "./admin/admin-notification"
import { DepartmentManagement } from "./admin/department-management"
import { SessionManagement } from "./admin/session-management"
import { AdminOverview } from "./admin/admin-overview"
import { ClassManagement } from "./admin/class-management"
import { AcademyCalendar } from "../academy-calendar"



const sectionTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  users: "User Management",
  "faculty-attendance": "Faculty Attendance Verification",
  attendance: "Student Attendance Records",
  "faculty-attendance-record": "Faculty Attendance Records",
  departments: "Department Management",
  classes : "Class Management",
  "face-recognition": "Face Recognition",
  sessions: "Academic Sessions",
  "academy-calendar" : "Academy Calendar",
  notifications: "Notifications",
  reports: "Reports & Analytics",
  settings: "System Settings",
}

export function AdminDashboard({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "users": return <UserManagement />
    case "face-recognition": return <FaceRecognition/>
    case "faculty-attendance": return <FacultyAttendanceVerification />
    case "attendance": return <StudentAttendanceRecord />
    case "faculty-attendance-record": return <FacultyAttendanceRecord />
    case "departments": return <DepartmentManagement />
    case "sessions": return <SessionManagement />
    case "notifications": return <AdminNotifications />
    case "reports": return <AdminReports />
    case "academy-calendar" : return <AcademyCalendar/>
    case "settings": return <AdminSettings />
    case "classes": return <ClassManagement/>
    default: return <AdminOverview />
  }
}

export { sectionTitles as adminSectionTitles }
