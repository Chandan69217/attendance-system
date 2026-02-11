"use client"

import React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { subjectAttendanceData } from "@/lib/mock-data"
import {
  ClipboardList, FileText, Calendar, Bell, TrendingUp, TrendingDown,
  Clock, BookOpen, AlertCircle,
} from "lucide-react"



export function StudentOverview() {
  const { user } = useAuth()
  const { attendance, assignments, exams, notifications } = useAppState()
  const myAttendance = attendance.filter((a) => a.studentId === (user?.id ?? "S001"))
  const totalClasses = myAttendance.length
  const presentClasses = myAttendance.filter((a) => a.status === "present" || a.status === "late").length
  const overallPercent = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0
  const pendingAssignments = assignments.filter((a) => a.status === "pending").length
  const upcomingExams = exams.filter((e) => new Date(e.date) > new Date("2026-02-06")).length
  const unreadNotifs = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">{user?.name.split(" ").map((n) => n[0]).join("") ?? "S"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Welcome back, {user?.name?.split(" ")[0] ?? "Student"}</h3>
          <p className="text-sm text-muted-foreground">{user?.department} | {user?.class} | ID: {user?.id}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall Attendance", value: `${overallPercent}%`, icon: ClipboardList, bg: "bg-primary/10", text: "text-primary", trend: overallPercent >= 85 },
          { label: "Pending Assignments", value: pendingAssignments, icon: FileText, bg: "bg-chart-3/10", text: "text-chart-3" },
          { label: "Upcoming Exams", value: upcomingExams, icon: Calendar, bg: "bg-accent/10", text: "text-accent" },
          { label: "Unread Notices", value: unreadNotifs, icon: Bell, bg: "bg-destructive/10", text: "text-destructive" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.text}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
                  {s.trend !== undefined && (s.trend ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Subject-wise Attendance</CardTitle><CardDescription>Your attendance breakdown by subject</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {subjectAttendanceData.map((item) => (
              <div key={item.subject} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${item.percentage >= 85 ? "text-primary" : "text-destructive"}`}>{item.percentage}%</span>
                    {item.percentage < 85 && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Upcoming Deadlines</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {assignments.filter((a) => a.status === "pending").slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <FileText className="h-5 w-5 shrink-0 text-chart-3" />
                  <div className="flex-1"><p className="text-sm font-medium text-card-foreground">{assignment.title}</p><p className="text-xs text-muted-foreground">{assignment.subject}</p></div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /><span>{assignment.dueDate}</span></div>
                </div>
              ))}
              {assignments.filter((a) => a.status === "pending").length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No pending deadlines</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Next Exams</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {exams.slice(0, 3).map((exam) => {
                const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date("2026-02-06").getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={exam.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <BookOpen className="h-5 w-5 shrink-0 text-accent" />
                    <div className="flex-1"><p className="text-sm font-medium text-card-foreground">{exam.subject}</p><p className="text-xs text-muted-foreground">{exam.date} at {exam.time} - {exam.venue}</p></div>
                    <Badge variant="secondary" className="text-xs">{daysLeft}d left</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}