"use client"

import React, { useEffect, useCallback } from "react"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, AttendanceRecord, FacultyAttendance, Assignment, Exam, Notification, Department, AcademicSession, Class, AppSettings } from "./types"

import { getNotifications } from "@/service/notification.service"
import { getDepartments } from "@/service/dept.service"
import { getClasses } from "@/service/classes.service"
import { getFilterUsers } from "@/service/users.service"
import { getSessions } from "@/service/session.service"
import { getExams } from "@/service/exams.service"
import { getAssignments } from "@/service/assignments.service"
import { useWebSocket } from "@/hooks/useWebSocket"
import { API_BASE_URL, NOTIFICATION_API, WEBSOCKET_API, SETTINGS_API } from "./config"
import { StorageKey } from "./constants"
import { useAuth } from "./auth-context"


export interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "destructive"
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
  classes: Class[]
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>
}

const AppStateContext = createContext<AppStateContextType | null>(null)

const defaultSettings: AppSettings = {
  confidence_threshold: 85,
  late_threshold: 15,
  max_check_in_distance: 100,
  allow_student_self_attendance: true,
  require_faculty_verification: true,
  send_absent_notifications: true,
  email_notifications: true,
  low_attendance_alerts: true,
  daily_reports: false,
  min_attendance_percent: 75,
  semester_start: "2026-01-15",
  semester_end: "2026-05-30",
  holidays: ["2026-02-17", "2026-03-30", "2026-04-20"],
  latitude: 0,
  longitude: 0,
  check_in: "10:00 AM",
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [facultyAttendance, setFacultyAttendance] = useState<FacultyAttendance[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [sessions, setSessions] = useState<AcademicSession[]>([])
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const { user } = useAuth()
  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const handleMessage = useCallback((data: any) => {
    console.log("WebSocket message received:", data)
    const newNotification: Notification = {
      ...data,
      id: data.id || data._id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      read: data.read ?? false,
      created_at: data.created_at || data.timestamp || new Date().toISOString(),
      category: data.category || "announcement"
    }
    setNotifications((prev) => {
      // Avoid duplicate notifications if WS sends same message as initial fetch
      if (prev.some(n => n.id === newNotification.id)) return prev
      return [newNotification, ...prev]
    })
    addToast({
      title: "New Notification",
      description: data.message,
      variant: "default",
    })
  }, [addToast])


  // notification websockets

  const wsUrl = user ? `${API_BASE_URL.replace(/^http/, 'ws')}${WEBSOCKET_API.WS_GET_NOTIFICATION}/${user.id}` : '';
  const { connected, send } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
  })

  useEffect(() => {
    const getNotif = async () => {
      const fetchedNotifications = await getNotifications()
      setNotifications((prev) => {
        // Merge fetched notifications with ones already received via WebSocket
        const existingIds = new Set(prev.map(n => n.id))
        const uniqueFetched = fetchedNotifications.filter((n: any) => !existingIds.has(n.id || n._id))
        return [...prev, ...uniqueFetched.map((n: any) => ({
          ...n,
          id: n.id || n._id,
          created_at: n.created_at || n.timestamp
        }))]
      })
    }
    
    const getSettings = async () => {
      try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        if (!token) return
        const res = await fetch(`${API_BASE_URL}${SETTINGS_API.GET}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          if (data && data.data) {
            setSettings(data.data)
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err)
      }
    }

    const fetchCoreData = async () => {
      try {
        // Fetch departments
        const depts = await getDepartments()
        if (depts) setDepartments(depts)

        // Fetch classes
        const cls = await getClasses()
        if (cls) setClasses(cls)

        // Fetch users
        const usrs = await getFilterUsers()
        if (usrs) setUsers(usrs)

        // Fetch sessions
        const sess = await getSessions()
        if (sess) setSessions(sess)

        // Fetch exams
        const exms = await getExams()
        if (exms) setExams(exms)

        // Fetch assignments
        const assigns = await getAssignments()
        if (assigns) setAssignments(assigns)

      } catch (err) {
        console.error("Failed to fetch core data:", err)
      }
    }

    if (user) {
      getNotif()
      getSettings()
      fetchCoreData()
    } else {
      setNotifications([])
      setAttendance([])
      setFacultyAttendance([])
      setAssignments([])
      setExams([])
      setSettings(defaultSettings)
    }
  }, [user])

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
        classes, setClasses,
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
