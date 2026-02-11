"use client"

import { AcademyCalendar } from "../academy-calendar"
import { AttendanceCamera } from "./faculty/attendance-camera"
import { FacultyAssignments } from "./faculty/faculty-assignments"
import { FacultyAttendanceRecords } from "./faculty/faculty-attendance-record"
import { FacultyExams } from "./faculty/faculty-exam"
import { FacultyNotifications } from "./faculty/faculty-notification"
import { FacultyOverview } from "./faculty/faculty-overview"
import { FacultySelfAttendance } from "./faculty/faculty-self-attendance"



export function FacultyDashboard({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "my-attendance": return <FacultySelfAttendance />
    case "attendance-camera": return <AttendanceCamera />
    case "attendance": return <FacultyAttendanceRecords />
    case "assignments": return <FacultyAssignments />
    case "exams": return <FacultyExams />
    case "academy-calendar" : return <AcademyCalendar/>
    case "notifications": return <FacultyNotifications />
    default: return <FacultyOverview />
  }
}

export const facultySectionTitles: Record<string, string> = {
  overview: "Faculty Dashboard",
  "my-attendance": "My Attendance",
  "attendance-camera": "Mark Class Attendance",
  attendance: "Class Attendance Records",
  assignments: "Assignments",
  "academy-calendar": "Academy Calendar",
  exams: "Exam Schedules",
  notifications: "Send Notification",
}
