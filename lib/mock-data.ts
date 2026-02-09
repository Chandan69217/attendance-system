import type { User, AttendanceRecord, FacultyAttendance, Assignment, Exam, Notification, Department, AcademicSession } from "./types"

export const mockUsers: User[] = [
  { id: "A001", name: "Dr. Sarah Wilson", email: "sarah.wilson@university.edu", role: "admin", department: "Administration", phone: "+1-555-0100", joinDate: "2020-08-15", status: "active" },
  { id: "F001", name: "Prof. James Carter", email: "james.carter@university.edu", role: "faculty", department: "Computer Science", phone: "+1-555-0201", joinDate: "2021-01-10", status: "active" },
  { id: "F002", name: "Dr. Emily Chen", email: "emily.chen@university.edu", role: "faculty", department: "Mathematics", phone: "+1-555-0202", joinDate: "2021-06-20", status: "active" },
  { id: "F003", name: "Prof. Robert Davis", email: "robert.davis@university.edu", role: "faculty", department: "Physics", phone: "+1-555-0203", joinDate: "2022-01-05", status: "active" },
  { id: "F004", name: "Dr. Lisa Wang", email: "lisa.wang@university.edu", role: "faculty", department: "Computer Science", phone: "+1-555-0204", joinDate: "2023-08-15", status: "active" },
  { id: "S001", name: "Alex Thompson", email: "alex.t@student.edu", role: "student", department: "Computer Science", class: "CS-301", phone: "+1-555-0301", joinDate: "2024-08-20", status: "active" },
  { id: "S002", name: "Maria Garcia", email: "maria.g@student.edu", role: "student", department: "Computer Science", class: "CS-301", phone: "+1-555-0302", joinDate: "2024-08-20", status: "active" },
  { id: "S003", name: "Ryan Patel", email: "ryan.p@student.edu", role: "student", department: "Computer Science", class: "CS-301", phone: "+1-555-0303", joinDate: "2024-08-20", status: "active" },
  { id: "S004", name: "Sophie Lee", email: "sophie.l@student.edu", role: "student", department: "Mathematics", class: "MA-201", phone: "+1-555-0304", joinDate: "2024-08-20", status: "active" },
  { id: "S005", name: "David Kim", email: "david.k@student.edu", role: "student", department: "Computer Science", class: "CS-301", phone: "+1-555-0305", joinDate: "2024-08-20", status: "active" },
  { id: "S006", name: "Emma Brown", email: "emma.b@student.edu", role: "student", department: "Mathematics", class: "MA-201", phone: "+1-555-0306", joinDate: "2024-08-20", status: "active" },
  { id: "S007", name: "James Wilson", email: "james.w@student.edu", role: "student", department: "Physics", class: "PH-101", phone: "+1-555-0307", joinDate: "2024-08-20", status: "active" },
  { id: "S008", name: "Olivia Martinez", email: "olivia.m@student.edu", role: "student", department: "Computer Science", class: "CS-302", phone: "+1-555-0308", joinDate: "2024-08-20", status: "inactive" },
]

export const mockAttendance: AttendanceRecord[] = [
  { id: "AT001", studentId: "S001", studentName: "Alex Thompson", date: "2026-02-09", status: "present", subject: "Data Structures", markedBy: "F001", method: "face-recognition" },
  { id: "AT002", studentId: "S002", studentName: "Maria Garcia", date: "2026-02-09", status: "present", subject: "Data Structures", markedBy: "F001", method: "face-recognition" },
  { id: "AT003", studentId: "S003", studentName: "Ryan Patel", date: "2026-02-09", status: "absent", subject: "Data Structures", markedBy: "F001", method: "manual" },
  { id: "AT004", studentId: "S004", studentName: "Sophie Lee", date: "2026-02-09", status: "present", subject: "Linear Algebra", markedBy: "F002", method: "face-recognition" },
  { id: "AT005", studentId: "S005", studentName: "David Kim", date: "2026-02-12", status: "late", subject: "Data Structures", markedBy: "F001", method: "self-marked" },
  { id: "AT006", studentId: "S006", studentName: "Emma Brown", date: "2026-02-12", status: "present", subject: "Linear Algebra", markedBy: "F002", method: "face-recognition" },
  { id: "AT007", studentId: "S001", studentName: "Alex Thompson", date: "2026-02-12", status: "present", subject: "Algorithms", markedBy: "F001", method: "face-recognition" },
  { id: "AT008", studentId: "S002", studentName: "Maria Garcia", date: "2026-02-12", status: "absent", subject: "Algorithms", markedBy: "F001", method: "manual" },
  { id: "AT009", studentId: "S003", studentName: "Ryan Patel", date: "2026-02-11", status: "present", subject: "Algorithms", markedBy: "F001", method: "self-marked" },
  { id: "AT010", studentId: "S005", studentName: "David Kim", date: "2026-02-11", status: "present", subject: "Algorithms", markedBy: "F001", method: "face-recognition" },
  { id: "AT011", studentId: "S001", studentName: "Alex Thompson", date: "2026-02-04", status: "present", subject: "Data Structures", markedBy: "F001", method: "face-recognition" },
  { id: "AT012", studentId: "S002", studentName: "Maria Garcia", date: "2026-02-04", status: "present", subject: "Data Structures", markedBy: "F001", method: "face-recognition" },
  { id: "AT013", studentId: "S003", studentName: "Ryan Patel", date: "2026-02-04", status: "present", subject: "Data Structures", markedBy: "F001", method: "self-marked" },
  { id: "AT014", studentId: "S005", studentName: "David Kim", date: "2026-02-04", status: "absent", subject: "Data Structures", markedBy: "F001", method: "manual" },
]

export const mockFacultyAttendance: FacultyAttendance[] = [
  { id: "FA001", facultyId: "F001", facultyName: "Prof. James Carter", date: "2026-02-06", checkIn: "08:45 AM", checkOut: "05:10 PM", status: "present", verifiedBy: "A001", verificationStatus: "approved" },
  { id: "FA002", facultyId: "F002", facultyName: "Dr. Emily Chen", date: "2026-02-06", checkIn: "09:02 AM", checkOut: "04:55 PM", status: "present", verifiedBy: "A001", verificationStatus: "approved" },
  { id: "FA003", facultyId: "F003", facultyName: "Prof. Robert Davis", date: "2026-02-06", checkIn: "09:20 AM", status: "late", verificationStatus: "pending", remarks: "Traffic delay" },
  { id: "FA004", facultyId: "F004", facultyName: "Dr. Lisa Wang", date: "2026-02-06", checkIn: "", status: "on-leave", verificationStatus: "approved", verifiedBy: "A001", remarks: "Medical leave" },
  { id: "FA005", facultyId: "F001", facultyName: "Prof. James Carter", date: "2026-02-05", checkIn: "08:30 AM", checkOut: "05:00 PM", status: "present", verifiedBy: "A001", verificationStatus: "approved" },
  { id: "FA006", facultyId: "F002", facultyName: "Dr. Emily Chen", date: "2026-02-05", checkIn: "08:55 AM", checkOut: "05:05 PM", status: "present", verifiedBy: "A001", verificationStatus: "approved" },
  { id: "FA007", facultyId: "F003", facultyName: "Prof. Robert Davis", date: "2026-02-05", checkIn: "08:40 AM", checkOut: "04:50 PM", status: "present", verificationStatus: "pending" },
  { id: "FA008", facultyId: "F004", facultyName: "Dr. Lisa Wang", date: "2026-02-05", checkIn: "09:00 AM", checkOut: "05:00 PM", status: "present", verificationStatus: "pending" },
  { id: "FA009", facultyId: "F001", facultyName: "Prof. James Carter", date: "2026-02-04", checkIn: "08:50 AM", checkOut: "05:15 PM", status: "present", verifiedBy: "A001", verificationStatus: "approved" },
  { id: "FA010", facultyId: "F002", facultyName: "Dr. Emily Chen", date: "2026-02-04", checkIn: "", status: "absent", verificationStatus: "approved", verifiedBy: "A001", remarks: "Sick leave" },
]

export const mockDepartments: Department[] = [
  { id: "D001", name: "Computer Science", head: "Prof. James Carter", studentCount: 45, facultyCount: 2 },
  { id: "D002", name: "Mathematics", head: "Dr. Emily Chen", studentCount: 32, facultyCount: 1 },
  { id: "D003", name: "Physics", head: "Prof. Robert Davis", studentCount: 28, facultyCount: 1 },
]

export const mockSessions: AcademicSession[] = [
  { id: "SES001", name: "Spring 2026", startDate: "2026-01-15", endDate: "2026-05-30", status: "active" },
  { id: "SES002", name: "Fall 2026", startDate: "2026-08-20", endDate: "2026-12-15", status: "upcoming" },
  { id: "SES003", name: "Fall 2025", startDate: "2025-08-20", endDate: "2025-12-15", status: "completed" },
]

export const mockAssignments: Assignment[] = [
  { id: "AS001", title: "Binary Tree Implementation", subject: "Data Structures", dueDate: "2026-02-15", description: "Implement a balanced binary search tree with insert, delete, and search operations.", status: "pending", createdBy: "F001" },
  { id: "AS002", title: "Sorting Algorithm Analysis", subject: "Algorithms", dueDate: "2026-02-20", description: "Compare time complexity of quicksort, mergesort, and heapsort with benchmarks.", status: "pending", createdBy: "F001" },
  { id: "AS003", title: "Matrix Operations", subject: "Linear Algebra", dueDate: "2026-02-12", description: "Solve the given system of linear equations using Gaussian elimination.", status: "submitted", createdBy: "F002" },
  { id: "AS004", title: "Graph Traversal", subject: "Data Structures", dueDate: "2026-02-25", description: "Implement BFS and DFS and demonstrate on a given graph.", status: "pending", createdBy: "F001" },
]

export const mockExams: Exam[] = [
  { id: "E001", subject: "Data Structures", date: "2026-03-10", time: "09:00 AM", venue: "Hall A", type: "Mid-term" },
  { id: "E002", subject: "Algorithms", date: "2026-03-12", time: "02:00 PM", venue: "Hall B", type: "Mid-term" },
  { id: "E003", subject: "Linear Algebra", date: "2026-03-14", time: "09:00 AM", venue: "Hall C", type: "Mid-term" },
  { id: "E004", subject: "Data Structures", date: "2026-05-20", time: "09:00 AM", venue: "Hall A", type: "Final" },
]

export const mockNotifications: Notification[] = [
  { id: "N001", title: "Mid-term Schedule Released", message: "The mid-term examination schedule for Spring 2026 has been published.", category: "exam", read: false, timestamp: "2026-02-06T10:00:00Z" },
  { id: "N002", title: "Assignment Due Reminder", message: "Binary Tree Implementation is due on Feb 15, 2026.", category: "assignment", read: false, timestamp: "2026-02-06T08:30:00Z" },
  { id: "N003", title: "Campus Holiday Notice", message: "The campus will be closed on Feb 17 for Presidents' Day.", category: "announcement", read: true, timestamp: "2026-02-05T14:00:00Z" },
  { id: "N004", title: "New Assignment Posted", message: "Graph Traversal assignment has been posted for Data Structures.", category: "assignment", read: false, timestamp: "2026-02-05T09:00:00Z" },
  { id: "N005", title: "Lab Session Rescheduled", message: "Friday's lab session has been moved to Saturday 10 AM.", category: "announcement", read: true, timestamp: "2026-02-04T16:00:00Z" },
  { id: "N006", title: "Attendance Marked", message: "Your attendance for Data Structures on Feb 6 has been recorded.", category: "attendance", read: false, timestamp: "2026-02-06T09:15:00Z" },
]

export const weeklyAttendanceData = [
  { day: "Mon", present: 42, absent: 8 },
  { day: "Tue", present: 45, absent: 5 },
  { day: "Wed", present: 38, absent: 12 },
  { day: "Thu", present: 44, absent: 6 },
  { day: "Fri", present: 40, absent: 10 },
]

export const monthlyAttendanceData = [
  { month: "Sep", percentage: 92 },
  { month: "Oct", percentage: 88 },
  { month: "Nov", percentage: 90 },
  { month: "Dec", percentage: 85 },
  { month: "Jan", percentage: 91 },
  { month: "Feb", percentage: 89 },
]

export const subjectAttendanceData = [
  { subject: "Data Structures", percentage: 88 },
  { subject: "Algorithms", percentage: 92 },
  { subject: "Linear Algebra", percentage: 85 },
  { subject: "Databases", percentage: 90 },
]
