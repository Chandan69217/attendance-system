"use client"

import { StudentMarkAttendance } from "./student/student-self-attendance"
import { StudentOverview } from "./student/student-overview"
import { StudentNotifications } from "./student/student-notification"
import { StudentProfile } from "./student/student-profile"
import { StudentExams } from "./student/student-exam"
import { StudentAttendance } from "./student/student-attendance"
import { StudentAssignments } from "./student/student-assignment"
import { AcademyCalendar } from "../academy-calendar"



/* ─── Section Map & Export ───────────────────────────────────── */
export function StudentDashboard({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "mark-attendance": return <StudentMarkAttendance />
    case "attendance": return <StudentAttendance />
    case "assignments": return <StudentAssignments />
    case "exams": return <StudentExams />
    case "notifications": return <StudentNotifications />
    case "academy-calendar" : return <AcademyCalendar/>
    case "profile": return <StudentProfile />
    default: return <StudentOverview />
  }
}

export const studentSectionTitles: Record<string, string> = {
  overview: "Student Dashboard",
  "mark-attendance": "Mark Attendance",
  attendance: "My Attendance",
  assignments: "Assignments",
  "academy-calendar" : "Academy Calendar",
  exams: "Exam Schedule",
  notifications: "Notifications",
  profile: "Profile",
}
