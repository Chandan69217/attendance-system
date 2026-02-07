"use client"

import React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { subjectAttendanceData } from "@/lib/mock-data"
import {
  ClipboardList, FileText, Calendar, Bell, User, TrendingUp, TrendingDown,
  Clock, BookOpen, AlertCircle, Fingerprint, MapPin, CheckCircle2, ScanFace, Save,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

/* ─── Student Overview ───────────────────────────────────────── */
function StudentOverview() {
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

/* ─── Student Self Attendance ────────────────────────────────── */
function StudentMarkAttendance() {
  const { user } = useAuth()
  const { attendance, setAttendance, addToast } = useAppState()
  const [isMarking, setIsMarking] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isMarked, setIsMarked] = useState(false)
  const [markedSubjects, setMarkedSubjects] = useState<string[]>(() => {
    const myToday = attendance.filter((a) => a.studentId === (user?.id ?? "S001") && a.date === "2026-02-06")
    return myToday.map((a) => a.subject)
  })

  const todayClasses = [
    { id: "CL1", subject: "Data Structures", time: "09:00 AM - 10:00 AM", room: "Room 301", faculty: "Prof. James Carter" },
    { id: "CL2", subject: "Algorithms", time: "10:30 AM - 11:30 AM", room: "Room 302", faculty: "Prof. James Carter" },
    { id: "CL3", subject: "Linear Algebra", time: "02:00 PM - 03:00 PM", room: "Room 201", faculty: "Dr. Emily Chen" },
  ]

  const handleMarkAttendance = (subject: string) => {
    setIsMarking(true)
    setSelectedSubject(subject)
    setTimeout(() => {
      setIsMarking(false)
      setIsMarked(true)
      setMarkedSubjects((prev) => [...prev, subject])
      setAttendance((prev) => [...prev, {
        id: `AT${Date.now()}`,
        studentId: user?.id ?? "S001",
        studentName: user?.name ?? "Student",
        date: "2026-02-06",
        status: "present",
        subject,
        markedBy: user?.id ?? "S001",
        method: "self-marked",
      }])
      addToast({ title: "Attendance Marked", description: `Your attendance for ${subject} has been recorded.`, variant: "success" })
      setTimeout(() => { setIsMarked(false); setSelectedSubject("") }, 2000)
    }, 2500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div><h3 className="text-lg font-semibold text-foreground">Mark Attendance</h3><p className="text-sm text-muted-foreground">{"Mark your attendance for today's classes using face verification"}</p></div>

      {isMarking && (
        <Card className="border-primary/30 bg-primary/[0.02]">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <div className="relative"><div className="h-24 w-24 animate-pulse rounded-full bg-primary/10" /><ScanFace className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse text-primary" /></div>
            <p className="text-sm font-medium text-foreground">Verifying your identity...</p>
            <p className="text-xs text-muted-foreground">Scanning face for {selectedSubject}</p>
          </CardContent>
        </Card>
      )}

      {isMarked && (
        <Card className="border-primary/30 bg-primary/[0.03]">
          <CardContent className="flex items-center gap-4 p-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <div><p className="text-sm font-semibold text-foreground">Attendance Marked Successfully</p><p className="text-xs text-muted-foreground">Your attendance for {selectedSubject} has been recorded.</p></div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">{"Today's Classes"} - Feb 6, 2026</CardTitle><CardDescription>Tap the button to mark your attendance for each class</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {todayClasses.map((cls) => {
              const alreadyMarked = markedSubjects.includes(cls.subject)
              return (
                <div key={cls.id} className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${alreadyMarked ? "border-primary/20 bg-primary/[0.02]" : "border-border"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${alreadyMarked ? "bg-primary/10" : "bg-muted"}`}>
                      <BookOpen className={`h-6 w-6 ${alreadyMarked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cls.subject}</p>
                      <p className="text-xs text-muted-foreground">{cls.time} | {cls.room}</p>
                      <p className="text-xs text-muted-foreground">{cls.faculty}</p>
                    </div>
                  </div>
                  {alreadyMarked ? (
                    <Badge className="bg-primary/15 text-primary border-primary/20 self-start sm:self-auto"><CheckCircle2 className="mr-1 h-3 w-3" />Marked</Badge>
                  ) : (
                    <Button onClick={() => handleMarkAttendance(cls.subject)} disabled={isMarking} className="gap-2 self-start sm:self-auto" size="sm"><Fingerprint className="h-4 w-4" />Mark Attendance</Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Self-attendance requires you to be within campus proximity and uses face verification for authenticity.</p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Student Attendance Records ─────────────────────────────── */
function StudentAttendance() {
  const { user } = useAuth()
  const { attendance } = useAppState()
  const myAttendance = attendance.filter((a) => a.studentId === (user?.id ?? "S001"))

  return (
    <div className="flex flex-col gap-6">
      <div><h3 className="text-lg font-semibold text-foreground">My Attendance</h3><p className="text-sm text-muted-foreground">Your complete attendance history</p></div>
      <Card>
        <CardHeader><CardTitle className="text-base">Attendance by Subject</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis type="category" dataKey="subject" width={120} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                <Bar dataKey="percentage" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Attendance Records</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Subject</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {myAttendance.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No attendance records yet</TableCell></TableRow>
              ) : myAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{record.subject}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{record.method?.replace("-", " ") ?? "manual"}</Badge></TableCell>
                  <TableCell>
                    <Badge className={record.status === "present" ? "bg-primary/15 text-primary border-primary/20" : record.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ��── Student Assignments ────────────────────────────────────── */
function StudentAssignments() {
  const { assignments, setAssignments, addToast } = useAppState()

  const handleSubmit = (id: string) => {
    setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, status: "submitted" as const } : a))
    const a = assignments.find((a) => a.id === id)
    addToast({ title: "Assignment Submitted", description: `"${a?.title}" has been submitted successfully.`, variant: "success" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div><h3 className="text-lg font-semibold text-foreground">Assignments</h3><p className="text-sm text-muted-foreground">View assignments and submission deadlines</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        {assignments.map((assignment) => {
          const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date("2026-02-06").getTime()) / (1000 * 60 * 60 * 24))
          return (
            <Card key={assignment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{assignment.title}</CardTitle>
                  <Badge variant="secondary" className={assignment.status === "pending" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-primary/15 text-primary border-primary/20"}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{assignment.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{assignment.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /><span>Due: {assignment.dueDate}</span>
                    {daysLeft > 0 && daysLeft <= 7 && <Badge variant="destructive" className="text-[10px]">{daysLeft}d left</Badge>}
                  </div>
                  {assignment.status === "pending" && (
                    <Button size="sm" onClick={() => handleSubmit(assignment.id)} className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />Submit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Student Exams ──────────────────────────────────────────── */
function StudentExams() {
  const { exams } = useAppState()
  return (
    <div className="flex flex-col gap-6">
      <div><h3 className="text-lg font-semibold text-foreground">Exam Schedule</h3><p className="text-sm text-muted-foreground">Upcoming examination timetable</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((exam) => {
          const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date("2026-02-06").getTime()) / (1000 * 60 * 60 * 24))
          return (
            <Card key={exam.id}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10">
                  <span className="text-xs font-medium text-primary">{new Date(exam.date).toLocaleDateString("en-US", { month: "short" })}</span>
                  <span className="text-lg font-bold text-primary">{new Date(exam.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{exam.subject}</p>
                  <p className="text-sm text-muted-foreground">{exam.time} - {exam.venue}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{exam.type}</Badge>
                    <span className="text-xs text-muted-foreground">{daysLeft > 0 ? `${daysLeft} days left` : "Today"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Student Profile ────────────────────────────────────────── */
function StudentProfile() {
  const { user } = useAuth()
  const { addToast } = useAppState()
  const [profileData, setProfileData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    department: user?.department ?? "",
    class: user?.class ?? "",
    id: user?.id ?? "",
  })

  const handleSave = () => {
    addToast({ title: "Profile Updated", description: "Your profile information has been saved.", variant: "success" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div><h3 className="text-lg font-semibold text-foreground">Profile</h3><p className="text-sm text-muted-foreground">Manage your profile information</p></div>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{user?.name.split(" ").map((n) => n[0]).join("") ?? "S"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2"><Label>Full Name</Label><Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} /></div>
                <div className="flex flex-col gap-2"><Label>Student ID</Label><Input value={profileData.id} readOnly className="bg-muted" /></div>
                <div className="flex flex-col gap-2"><Label>Email</Label><Input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} /></div>
                <div className="flex flex-col gap-2"><Label>Phone</Label><Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+1-555-0000" /></div>
                <div className="flex flex-col gap-2"><Label>Department</Label><Input value={profileData.department} readOnly className="bg-muted" /></div>
                <div className="flex flex-col gap-2"><Label>Class</Label><Input value={profileData.class} readOnly className="bg-muted" /></div>
              </div>
              <Button onClick={handleSave} className="gap-2 self-start"><Save className="h-4 w-4" />Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Student Notifications ──────────────────────────────────── */
function StudentNotifications() {
  const { notifications, setNotifications, addToast } = useAppState()

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    addToast({ title: "All Read", description: "All notifications marked as read.", variant: "default" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Notifications</h3><p className="text-sm text-muted-foreground">Stay updated with announcements and alerts</p></div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="bg-transparent">Mark All Read</Button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`cursor-pointer transition-colors ${!notif.read ? "border-primary/20 bg-primary/[0.02]" : ""}`}
            onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notif.category === "exam" ? "bg-accent/10" : notif.category === "assignment" ? "bg-chart-3/10" : notif.category === "attendance" ? "bg-primary/10" : "bg-primary/10"}`}>
                {notif.category === "exam" ? <BookOpen className="h-5 w-5 text-accent" />
                : notif.category === "assignment" ? <FileText className="h-5 w-5 text-chart-3" />
                : notif.category === "attendance" ? <CheckCircle2 className="h-5 w-5 text-primary" />
                : <Bell className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${!notif.read ? "font-semibold" : ""} text-card-foreground`}>{notif.title}</p>
                  {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notif.message}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{new Date(notif.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Section Map & Export ───────────────────────────────────── */
export function StudentDashboard({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "mark-attendance": return <StudentMarkAttendance />
    case "attendance": return <StudentAttendance />
    case "assignments": return <StudentAssignments />
    case "exams": return <StudentExams />
    case "notifications": return <StudentNotifications />
    case "profile": return <StudentProfile />
    default: return <StudentOverview />
  }
}

export const studentSectionTitles: Record<string, string> = {
  overview: "Student Dashboard",
  "mark-attendance": "Mark Attendance",
  attendance: "My Attendance",
  assignments: "Assignments",
  exams: "Exam Schedule",
  notifications: "Notifications",
  profile: "Profile",
}
