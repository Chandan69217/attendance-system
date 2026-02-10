"use client"

import React from "react"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User, AttendanceRecord, FacultyAttendance, Assignment, Exam, Notification, Department, AcademicSession } from "./types"
import {
  mockUsers, mockAttendance, mockFacultyAttendance, mockAssignments,
  mockExams, mockNotifications, mockDepartments, mockSessions,
} from "./mock-data"

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "destructive"
}

interface AppSettings {
  confidenceThreshold: number
  lateThreshold: number
  maxCheckInDistance: number
  allowStudentSelfAttendance: boolean
  requireFacultyVerification: boolean
  sendAbsentNotifications: boolean
  emailNotifications: boolean
  lowAttendanceAlerts: boolean
  dailyReports: boolean
  minAttendancePercent: number
  semesterStart: string
  semesterEnd: string
  holidays: string
  latitude:number
  longitude: number

}

interface AppStateContextType {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  attendance: AttendanceRecord[]
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>
  facultyAttendance: FacultyAttendance[]
  setFacultyAttendance: React.Dispatch<React.SetStateAction<FacultyAttendance[]>>
  assignments: Assignment[]
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>
  exams: Exam[]
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  departments: Department[]
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>
  sessions: AcademicSession[]
  setSessions: React.Dispatch<React.SetStateAction<AcademicSession[]>>
  settings: AppSettings
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const AppStateContext = createContext<AppStateContextType | null>(null)

const defaultSettings: AppSettings = {
  confidenceThreshold: 85,
  lateThreshold: 15,
  maxCheckInDistance: 100,
  allowStudentSelfAttendance: true,
  requireFacultyVerification: true,
  sendAbsentNotifications: true,
  emailNotifications: true,
  lowAttendanceAlerts: true,
  dailyReports: false,
  minAttendancePercent: 75,
  semesterStart: "2026-01-15",
  semesterEnd: "2026-05-30",
  holidays: "2026-02-17, 2026-03-30, 2026-04-20",
  latitude:0,
  longitude:0,
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance)
  const [facultyAttendance, setFacultyAttendance] = useState<FacultyAttendance[]>(mockFacultyAttendance)
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [exams, setExams] = useState<Exam[]>(mockExams)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [sessions, setSessions] = useState<AcademicSession[]>(mockSessions)
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <AppStateContext.Provider
      value={{
        users, setUsers,
        attendance, setAttendance,
        facultyAttendance, setFacultyAttendance,
        assignments, setAssignments,
        exams, setExams,
        notifications, setNotifications,
        departments, setDepartments,
        sessions, setSessions,
        settings, setSettings,
        toasts, addToast, removeToast,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
