export type Role = "admin" | "faculty" | "student"
export type UserStatus = "active" | "inactive" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
  dept_id?:string
  class_id?:string
  class?: string
  avatar?: string
  phone?: string
  join_date?: string
  status?: UserStatus
}


export interface UserUpdatePayload {
  name?: string
  email?: string
  role?: Role
  dept_id?: string
  class_id?: string
  avatar?: string
  phone?: string
  status?: UserStatus
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
  head_id: string
  head_name?:string
  student_count: number
  faculty_count: number
}

export interface AcademicSession {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "active" | "upcoming" | "completed"
}


export interface Class {
  id: string
  name: string
  class_teacher_id:string
  class_teacher:string,
  dept_id:string
  dept_name:string
  student_count: string
  created_at:string
  create_bu:string
}


