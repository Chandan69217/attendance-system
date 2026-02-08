import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AttendanceRecord } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeeklyAttendanceChartData(
  attendance:any[],
  referenceDate: string
) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const ref = new Date(referenceDate)

  const startOfWeek = new Date(ref)
  startOfWeek.setDate(ref.getDate() - ((ref.getDay() + 6) % 7))

  return Array.from({ length: 6 }).map((_, i) => {
    const dayDate = new Date(startOfWeek)
    dayDate.setDate(startOfWeek.getDate() + i)


    const dayStr = dayDate.toLocaleDateString("en-CA")

    const dayAttendance = attendance.filter(
      (a) => a.date === dayStr
    )

    return {
      day: days[dayDate.getDay()],
      present: dayAttendance.filter(
        (a) => ["present", "late"].includes(a.status)
      ).length,
      absent: dayAttendance.filter(
        (a) => ["absent","on-leave"].includes(a.status)
      ).length,
    }
  })
}




export function getMonthlyAttendanceChartData(
  attendance: any[],
  year: number
) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return months.map((month, index) => {
    const monthly = attendance.filter((a) => {
      const d = new Date(a.date)
      return d.getFullYear() === year && d.getMonth() === index
    })

    const total = monthly.length
    const present = monthly.filter((a) => a.status === "present").length

    return {
      month,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    }
  })
}



export function getSubjectAttendanceChartData(
  attendance: AttendanceRecord[]
) {
  const subjectMap: Record<string, AttendanceRecord[]> = {}

  attendance.forEach((a) => {
    if (!subjectMap[a.subject]) {
      subjectMap[a.subject] = []
    }
    subjectMap[a.subject].push(a)
  })

  return Object.entries(subjectMap).map(([subject, records]) => {
    const total = records.length
    const present = records.filter((r) => r.status === "present").length

    return {
      subject,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    }
  })
}



export function getSubjectAttendanceSummary(
  attendance: AttendanceRecord[]
) {
  return attendance.reduce<
    Record<
      string,
      { present: number; absent: number; late: number; total: number }
    >
  >((acc, a) => {
    if (!acc[a.subject]) {
      acc[a.subject] = { present: 0, absent: 0, late: 0, total: 0 }
    }

    acc[a.subject][a.status]++
    acc[a.subject].total++

    return acc
  }, {})
}
