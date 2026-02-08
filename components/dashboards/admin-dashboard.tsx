"use client"

import React from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { weeklyAttendanceData, monthlyAttendanceData } from "@/lib/mock-data"
import type { User, FacultyAttendance } from "@/lib/types"
import {
  Users, ClipboardList, GraduationCap, Search, Download, TrendingUp, TrendingDown,
  UserPlus, Edit3, Trash2, CheckCircle2, XCircle, Clock, Eye, Building2, CalendarDays,
  Ban, RotateCcw, Mail, Phone, Plus, Bell, Send,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Legend } from "recharts"
import { UserManagement } from "./admin/user-management"
import { FacultyAttendanceVerification } from "./admin/faculty-attendance-verification"
import { StudentAttendanceRecord } from "./admin/student-attendance-record"
import { FacultyAttendanceRecord } from "./admin/faculty-attendance-record"

/* ─── Admin Overview ─────────────────────────────────────────── */
function AdminOverview() {
  const { users, attendance, facultyAttendance } = useAppState()
  const totalStudents = users.filter((u) => u.role === "student").length
  const totalFaculty = users.filter((u) => u.role === "faculty").length
  const todayAttendance = attendance.filter((a) => a.date === "2026-02-06")
  const todayPresent = todayAttendance.filter((a) => a.status === "present").length
  const todayTotal = todayAttendance.length
  const attendanceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0
  const pendingVerifications = facultyAttendance.filter((fa) => fa.verificationStatus === "pending").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Dashboard Overview</h3>
        <p className="text-sm text-muted-foreground">System-wide summary and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: totalStudents, icon: GraduationCap, bg: "bg-primary/10", text: "text-primary" },
          { label: "Total Faculty", value: totalFaculty, icon: Users, bg: "bg-accent/10", text: "text-accent" },
          { label: "Today's Rate", value: `${attendanceRate}%`, icon: ClipboardList, bg: "bg-chart-3/10", text: "text-chart-3", trend: attendanceRate >= 80 },
          { label: "Pending Verifications", value: pendingVerifications, icon: Clock, bg: "bg-destructive/10", text: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.text}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  {stat.trend !== undefined && (stat.trend ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Attendance</CardTitle>
            <CardDescription>Present vs absent students this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                  <Legend />
                  <Bar dataKey="present" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Attendance Trend</CardTitle>
            <CardDescription>Average attendance percentage per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                  <Line type="monotone" dataKey="percentage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))" }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Attendance</CardTitle>
          <CardDescription>Last recorded attendance entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.slice(0, 6).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.studentName}</TableCell>
                  <TableCell>{r.subject}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{r.method?.replace("-", " ") ?? "manual"}</Badge></TableCell>
                  <TableCell>
                    <Badge className={r.status === "present" ? "bg-primary/15 text-primary border-primary/20" : r.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
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


/* ─── Department Management ──────────────────────────────────── */
function DepartmentManagement() {
  const { departments, setDepartments, addToast } = useAppState()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDept, setNewDept] = useState({ name: "", head: "" })

  const handleAdd = () => {
    if (!newDept.name) return
    setDepartments((prev) => [...prev, { id: `D${Date.now()}`, name: newDept.name, head: newDept.head, studentCount: 0, facultyCount: 0 }])
    setNewDept({ name: "", head: "" })
    setIsAddOpen(false)
    addToast({ title: "Department Added", description: `${newDept.name} has been created.`, variant: "success" })
  }

  const handleDelete = (id: string) => {
    const d = departments.find((d) => d.id === id)
    setDepartments((prev) => prev.filter((d) => d.id !== id))
    addToast({ title: "Department Removed", description: `${d?.name} has been deleted.`, variant: "destructive" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Department Management</h3>
          <p className="text-sm text-muted-foreground">Manage departments and assign department heads</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Building2 className="h-4 w-4" />Add Department</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Department</DialogTitle><DialogDescription>Create a new academic department.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"><Label>Department Name</Label><Input value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} placeholder="e.g. Electronics" /></div>
              <div className="flex flex-col gap-2"><Label>Department Head</Label><Input value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} placeholder="e.g. Dr. John Smith" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAdd} disabled={!newDept.name}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(dept.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <CardTitle className="text-base">{dept.name}</CardTitle>
              <CardDescription>Head: {dept.head || "Not assigned"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><GraduationCap className="h-4 w-4" /><span>{dept.studentCount} Students</span></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /><span>{dept.facultyCount} Faculty</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Academic Session Management ────────────────────────────── */
function SessionManagement() {
  const { sessions, setSessions, addToast } = useAppState()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newSession, setNewSession] = useState({ name: "", startDate: "", endDate: "" })

  const handleAdd = () => {
    if (!newSession.name) return
    setSessions((prev) => [...prev, { id: `SES${Date.now()}`, ...newSession, status: "upcoming" as const }])
    setNewSession({ name: "", startDate: "", endDate: "" })
    setIsAddOpen(false)
    addToast({ title: "Session Created", description: `${newSession.name} has been added.`, variant: "success" })
  }

  const handleDelete = (id: string) => {
    const s = sessions.find((s) => s.id === id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
    addToast({ title: "Session Removed", description: `${s?.name} has been deleted.`, variant: "destructive" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Academic Sessions</h3>
          <p className="text-sm text-muted-foreground">Manage semesters, terms, and academic calendars</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><CalendarDays className="h-4 w-4" />New Session</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Session</DialogTitle><DialogDescription>Add a new academic session.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"><Label>Session Name</Label><Input value={newSession.name} onChange={(e) => setNewSession({ ...newSession, name: e.target.value })} placeholder="e.g. Summer 2026" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2"><Label>Start Date</Label><Input type="date" value={newSession.startDate} onChange={(e) => setNewSession({ ...newSession, startDate: e.target.value })} /></div>
                <div className="flex flex-col gap-2"><Label>End Date</Label><Input type="date" value={newSession.endDate} onChange={(e) => setNewSession({ ...newSession, endDate: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAdd} disabled={!newSession.name}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className={session.status === "active" ? "border-primary/30" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{session.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Badge className={session.status === "active" ? "bg-primary/15 text-primary border-primary/20" : session.status === "upcoming" ? "bg-accent/15 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(session.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>Start: {session.startDate}</span></div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>End: {session.endDate}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Admin Notifications ────────────────────────────────────── */
function AdminNotifications() {
  const { notifications, setNotifications, addToast } = useAppState()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState<"announcement" | "exam" | "assignment">("announcement")
  const [target, setTarget] = useState("all")

  const handleSend = () => {
    if (!title || !message) return
    const newNotif = {
      id: `N${Date.now()}`,
      title,
      message,
      category,
      read: false,
      timestamp: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])
    setTitle("")
    setMessage("")
    addToast({ title: "Notification Sent", description: `"${title}" has been broadcast.`, variant: "success" })
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    addToast({ title: "All Read", description: "All notifications marked as read.", variant: "default" })
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          <p className="text-sm text-muted-foreground">Broadcast announcements and manage notifications</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="bg-transparent">Mark All Read</Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Send New Notification</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" /></div>
          <div className="flex flex-col gap-2"><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." rows={3} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Target</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="faculty">Faculty Only</SelectItem>
                  <SelectItem value="student">Students Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSend} disabled={!title || !message} className="gap-2 self-start"><Send className="h-4 w-4" />Send Notification</Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className={!notif.read ? "border-primary/20 bg-primary/[0.02]" : ""}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notif.category === "exam" ? "bg-accent/10" : notif.category === "assignment" ? "bg-chart-3/10" : "bg-primary/10"}`}>
                {notif.category === "exam" ? <CalendarDays className="h-5 w-5 text-accent" /> : notif.category === "assignment" ? <ClipboardList className="h-5 w-5 text-chart-3" /> : <Bell className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${!notif.read ? "font-semibold" : ""} text-card-foreground`}>{notif.title}</p>
                  {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notif.message}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{new Date(notif.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground" onClick={() => handleDelete(notif.id)}><Trash2 className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Admin Reports ──────────────────────────────────────────── */
function AdminReports() {
  const { facultyAttendance } = useAppState()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Generate and export attendance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export PDF</Button>
          <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export CSV</Button>
        </div>
      </div>
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="subject">By Subject</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Daily Attendance Report</CardTitle><CardDescription>Attendance breakdown for the week</CardDescription></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                    <Legend />
                    <Bar dataKey="present" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Present" />
                    <Bar dataKey="absent" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Trend</CardTitle><CardDescription>Attendance trend over the semester</CardDescription></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis domain={[70, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                    <Line type="monotone" dataKey="percentage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subject" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Subject-wise Attendance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {[{ subject: "Data Structures", pct: 88 }, { subject: "Algorithms", pct: 92 }, { subject: "Linear Algebra", pct: 85 }, { subject: "Databases", pct: 90 }].map((item) => (
                  <div key={item.subject} className="flex items-center gap-4">
                    <span className="w-36 text-sm font-medium text-foreground">{item.subject}</span>
                    <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.pct}%` }} /></div></div>
                    <span className="w-12 text-right text-sm font-semibold text-foreground">{item.pct}%</span>
                    {item.pct >= 90 ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-chart-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faculty" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Faculty Attendance Summary</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Leave/Absent</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["F001", "F002", "F003", "F004"].map((fid) => {
                    const records = facultyAttendance.filter((r) => r.facultyId === fid)
                    const name = records[0]?.facultyName ?? fid
                    return (
                      <TableRow key={fid}>
                        <TableCell className="font-medium text-foreground">{name}</TableCell>
                        <TableCell>{records.length}</TableCell>
                        <TableCell className="font-medium text-primary">{records.filter((r) => r.status === "present" || r.status === "late").length}</TableCell>
                        <TableCell className="font-medium text-destructive">{records.filter((r) => r.status === "absent" || r.status === "on-leave").length}</TableCell>
                        <TableCell><Badge className="bg-primary/15 text-primary border-primary/20">{records.filter((r) => r.verificationStatus === "approved").length}</Badge></TableCell>
                        <TableCell><Badge className="bg-chart-3/15 text-chart-3 border-chart-3/20">{records.filter((r) => r.verificationStatus === "pending").length}</Badge></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ─── Admin Settings ─────────────────────────────────────────── */
function AdminSettings() {
  const { settings, setSettings, addToast } = useAppState()

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = (section: string) => {
    addToast({ title: "Settings Saved", description: `${section} settings have been updated.`, variant: "success" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">System Settings</h3>
        <p className="text-sm text-muted-foreground">Configure recognition, attendance policies, and system preferences</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recognition Settings</CardTitle><CardDescription>Configure face recognition parameters</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2"><Label>Confidence Threshold (%)</Label><Input type="number" value={settings.confidenceThreshold} onChange={(e) => updateSetting("confidenceThreshold", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Minimum confidence for face matching</p></div>
            <div className="flex flex-col gap-2"><Label>Late Threshold (minutes)</Label><Input type="number" value={settings.lateThreshold} onChange={(e) => updateSetting("lateThreshold", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Minutes after class start to mark as late</p></div>
            <div className="flex flex-col gap-2"><Label>Max Self Check-In Distance (m)</Label><Input type="number" value={settings.maxCheckInDistance} onChange={(e) => updateSetting("maxCheckInDistance", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Geofencing radius for self-attendance</p></div>
            <Button className="self-start" onClick={() => handleSave("Recognition")}>Save Changes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Attendance Policies</CardTitle><CardDescription>Set institutional attendance rules</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between"><div><Label>Allow Student Self Attendance</Label><p className="text-xs text-muted-foreground">Students can mark their own attendance</p></div><Switch checked={settings.allowStudentSelfAttendance} onCheckedChange={(v) => updateSetting("allowStudentSelfAttendance", v)} /></div>
            <div className="flex items-center justify-between"><div><Label>Require Faculty Verification</Label><p className="text-xs text-muted-foreground">Faculty attendance verified by admin</p></div><Switch checked={settings.requireFacultyVerification} onCheckedChange={(v) => updateSetting("requireFacultyVerification", v)} /></div>
            <div className="flex items-center justify-between"><div><Label>Send Absent Notifications</Label><p className="text-xs text-muted-foreground">Auto-notify students marked absent</p></div><Switch checked={settings.sendAbsentNotifications} onCheckedChange={(v) => updateSetting("sendAbsentNotifications", v)} /></div>
            <div className="flex flex-col gap-2"><Label>Minimum Attendance (%)</Label><Input type="number" value={settings.minAttendancePercent} onChange={(e) => updateSetting("minAttendancePercent", Number(e.target.value))} /></div>
            <Button className="self-start" onClick={() => handleSave("Attendance Policies")}>Save Policies</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Academic Calendar</CardTitle><CardDescription>Manage semester dates and holidays</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2"><Label>Semester Start</Label><Input type="date" value={settings.semesterStart} onChange={(e) => updateSetting("semesterStart", e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Semester End</Label><Input type="date" value={settings.semesterEnd} onChange={(e) => updateSetting("semesterEnd", e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Holiday Dates (comma-separated)</Label><Textarea value={settings.holidays} onChange={(e) => updateSetting("holidays", e.target.value)} rows={2} /></div>
            <Button className="self-start" onClick={() => handleSave("Academic Calendar")}>Update Calendar</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Notification Settings</CardTitle><CardDescription>Configure system notifications</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between"><div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Send email for important events</p></div><Switch checked={settings.emailNotifications} onCheckedChange={(v) => updateSetting("emailNotifications", v)} /></div>
            <div className="flex items-center justify-between"><div><Label>Low Attendance Alerts</Label><p className="text-xs text-muted-foreground">Alert when student below threshold</p></div><Switch checked={settings.lowAttendanceAlerts} onCheckedChange={(v) => updateSetting("lowAttendanceAlerts", v)} /></div>
            <div className="flex items-center justify-between"><div><Label>Daily Reports</Label><p className="text-xs text-muted-foreground">Auto-generate daily summaries</p></div><Switch checked={settings.dailyReports} onCheckedChange={(v) => updateSetting("dailyReports", v)} /></div>
            <Button className="self-start" onClick={() => handleSave("Notification")}>Save Notifications</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─── Section Map & Export ───────────────────────────────────── */
const sectionTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  users: "User Management",
  "faculty-attendance": "Faculty Attendance Verification",
  attendance: "Student Attendance Records",
  "faculty-attendance-record": "Faculty Attendance Records",
  departments: "Department Management",
  sessions: "Academic Sessions",
  notifications: "Notifications",
  reports: "Reports & Analytics",
  settings: "System Settings",
}

export function AdminDashboard({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "users": return <UserManagement />
    case "faculty-attendance": return <FacultyAttendanceVerification />
    case "attendance": return <StudentAttendanceRecord />
    case "faculty-attendance-record": return <FacultyAttendanceRecord />
    case "departments": return <DepartmentManagement />
    case "sessions": return <SessionManagement />
    case "notifications": return <AdminNotifications />
    case "reports": return <AdminReports />
    case "settings": return <AdminSettings />
    default: return <AdminOverview />
  }
}

export { sectionTitles as adminSectionTitles }
