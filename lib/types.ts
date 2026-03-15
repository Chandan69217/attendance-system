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
  session_id?:string
  subject_id?:string
  subject_name?:string
  face_id?: number[]
}

export interface AppSettings {
  confidence_threshold: number
  late_threshold: number
  max_check_in_distance: number

  allow_student_self_attendance: boolean
  require_faculty_verification: boolean

  send_absent_notifications: boolean
  email_notifications: boolean
  low_attendance_alerts: boolean
  daily_reports: boolean

  min_attendance_percent: number

  semester_start: string
  semester_end: string

  holidays: string[] 

  latitude: number
  longitude: number

  check_in: string
}




export interface Lecture {
  id:string,
  subject_id:string,
  subject_name:string,
  faculty_id:string,
  faculty_name:string
  date:string,
  start_time:string,
  end_time:string,
  class_id:string,
  class_name:string,
  status: 'scheduled' | 'active' | 'closed',
  create_at: string,
  ended_at?:string,
  started_at?:string,
  updated_at?:string
}

export interface SubjectAttendance {
  subject:string,
  percenatge: number
}

export interface Subject {
  id:string,
  faculty_count: number,
  dept_name: string,
  dept_id: string,
  class_id:string,
  faculty_name:string,
  start_time:string,
  end_time:string,
  name: string
}

export interface UserUpdatePayload {
  name?: string
  email?: string
  role?: Role
  dept_id?: string
  class_id?: string
  subject_id?: string
  avatar?: string
  phone?: string
  status?: UserStatus
}

export interface AttendanceRecord {
  id: string
  student_id: string
  student_name: string
  date: string
  status: "present" | "absent" | "late"
  subject_id: string
  subject_name:string
  marked_by: string
  marked_name:string
  method?: "face-recognition" | "manual" | "self-marked"
  created_at:string
}

export interface FacultyAttendance {
  id: string
  faculty_id: string
  faculty_name: string
  date: string
  check_in: string
  check_out?: string
  status: "present" | "absent" | "late" | "on-leave"
  verify_by_id?: string
  verify_by_name?:string
  verification_status: "pending" | "approved" | "rejected"
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
  id?: string
  title: string
  message: string
  read?:boolean
  created_at?:string
  category: "exam" | "assignment" | "announcement" | "attendance"
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
  start_date: string
  end_date: string
  student_count:string
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


