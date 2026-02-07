export type Role = "admin" | "faculty" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
  class?: string
  avatar?: string
  phone?: string
  joinDate?: string
  status?: "active" | "inactive" | "suspended"
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  status: "present" | "absent" | "late"
  subject: string
  markedBy: string
  method?: "face-recognition" | "manual" | "self-marked"
}

export interface FacultyAttendance {
  id: string
  facultyId: string
  facultyName: string
  date: string
  checkIn: string
  checkOut?: string
  status: "present" | "absent" | "late" | "on-leave"
  verifiedBy?: string
  verificationStatus: "pending" | "approved" | "rejected"
  remarks?: string
}

export interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  description: string
  status: "pending" | "submitted" | "graded"
  createdBy: string
}

export interface Exam {
  id: string
  subject: string
  date: string
  time: string
  venue: string
  type: string
}

export interface Notification {
  id: string
  title: string
  message: string
  category: "exam" | "assignment" | "announcement" | "attendance"
  read: boolean
  timestamp: string
  targetRole?: Role
}

export interface Department {
  id: string
  name: string
  head: string
  studentCount: number
  facultyCount: number
}

export interface AcademicSession {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "active" | "upcoming" | "completed"
}
