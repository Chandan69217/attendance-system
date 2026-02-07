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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { weeklyAttendanceData } from "@/lib/mock-data"
import type { FacultyAttendance } from "@/lib/types"
import {
  Users, ClipboardList, FileText, Calendar, Camera, Download, Plus,
  CheckCircle2, XCircle, Clock, Video, Send, LogIn, LogOut,
  Fingerprint, MapPin, ShieldCheck,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"

/* ─── Faculty Overview ───────────────────────────────────────── */
function FacultyOverview() {
  const { user } = useAuth()
  const { attendance, facultyAttendance, assignments, exams } = useAppState()
  const todayRecords = attendance.filter((a) => a.date === "2026-02-06" && a.markedBy === "F001")
  const presentCount = todayRecords.filter((a) => a.status === "present").length
  const absentCount = todayRecords.filter((a) => a.status === "absent").length
  const pendingAssignments = assignments.filter((a) => a.status === "pending" && a.createdBy === "F001").length
  const myAttendance = facultyAttendance.filter((fa) => fa.facultyId === "F001")
  const myToday = myAttendance.find((fa) => fa.date === "2026-02-06")
  const pendingVerification = myAttendance.filter((fa) => fa.verificationStatus === "pending").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Welcome back, {user?.name?.split(" ").pop()}</h3>
        <p className="text-sm text-muted-foreground">Here is your daily summary and quick actions.</p>
      </div>

      <Card className={myToday?.verificationStatus === "approved" ? "border-primary/30" : myToday?.verificationStatus === "pending" ? "border-chart-3/30" : ""}>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${myToday ? "bg-primary/10" : "bg-muted"}`}>
              <Fingerprint className={`h-5 w-5 ${myToday ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Your Attendance Today</p>
              {myToday ? (
                <p className="text-xs text-muted-foreground">
                  Checked in at {myToday.checkIn} {myToday.checkOut ? `| Out: ${myToday.checkOut}` : "| Not checked out"} | Status: {myToday.verificationStatus}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Not checked in yet</p>
              )}
            </div>
          </div>
          {myToday?.verificationStatus === "approved" && <Badge className="bg-primary/15 text-primary border-primary/20">Verified</Badge>}
          {myToday?.verificationStatus === "pending" && <Badge className="bg-chart-3/15 text-chart-3 border-chart-3/20">Pending Verification</Badge>}
          {!myToday && <Badge variant="destructive">Not Marked</Badge>}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Students Present", value: presentCount, icon: CheckCircle2, bg: "bg-primary/10", text: "text-primary" },
          { label: "Students Absent", value: absentCount, icon: XCircle, bg: "bg-destructive/10", text: "text-destructive" },
          { label: "Pending Assignments", value: pendingAssignments, icon: FileText, bg: "bg-chart-3/10", text: "text-chart-3" },
          { label: "My Pending Verif.", value: pendingVerification, icon: Clock, bg: "bg-accent/10", text: "text-accent" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.text}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Weekly Class Attendance</CardTitle><CardDescription>Present vs absent for your classes</CardDescription></CardHeader>
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
    </div>
  )
}

/* ─── Faculty Self Attendance ────────────────────────────────── */
function FacultySelfAttendance() {
  const { user } = useAuth()
  const { facultyAttendance, setFacultyAttendance, addToast } = useAppState()
  const myRecords = facultyAttendance.filter((fa) => fa.facultyId === (user?.id ?? "F001"))
  const todayRecord = myRecords.find((r) => r.date === "2026-02-06")
  const isCheckedIn = !!todayRecord?.checkIn
  const isCheckedOut = !!todayRecord?.checkOut
  const [remarks, setRemarks] = useState("")

  const handleCheckIn = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    const isLate = now.getHours() >= 9 && now.getMinutes() > 15

    if (todayRecord) {
      setFacultyAttendance((prev) => prev.map((r) => r.id === todayRecord.id ? { ...r, checkIn: timeStr, status: isLate ? "late" as const : "present" as const, remarks: remarks || r.remarks } : r))
    } else {
      const newRecord: FacultyAttendance = {
        id: `FA${Date.now()}`,
        facultyId: user?.id ?? "F001",
        facultyName: user?.name ?? "Faculty",
        date: "2026-02-06",
        checkIn: timeStr,
        status: isLate ? "late" : "present",
        verificationStatus: "pending",
        remarks: remarks || undefined,
      }
      setFacultyAttendance((prev) => [newRecord, ...prev])
    }
    addToast({ title: "Checked In", description: `Check-in recorded at ${timeStr}. Pending admin verification.`, variant: "success" })
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    if (todayRecord) {
      setFacultyAttendance((prev) => prev.map((r) => r.id === todayRecord.id ? { ...r, checkOut: timeStr } : r))
    }
    addToast({ title: "Checked Out", description: `Check-out recorded at ${timeStr}.`, variant: "success" })
  }

  const currentToday = facultyAttendance.find((r) => r.facultyId === (user?.id ?? "F001") && r.date === "2026-02-06")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">My Attendance</h3>
        <p className="text-sm text-muted-foreground">Mark your daily attendance. This will be verified by the principal/admin.</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader><CardTitle className="text-base">Today - Feb 6, 2026</CardTitle><CardDescription>Mark your check-in and check-out</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isCheckedIn ? "bg-primary/10" : "bg-muted"}`}>
                  <LogIn className={`h-8 w-8 ${isCheckedIn ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className="text-sm font-medium text-foreground">Check In</p>
                {isCheckedIn && currentToday?.checkIn ? (
                  <p className="text-lg font-bold text-primary">{currentToday.checkIn}</p>
                ) : (
                  <Button onClick={handleCheckIn} className="gap-2"><Fingerprint className="h-4 w-4" />Check In Now</Button>
                )}
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isCheckedOut ? "bg-primary/10" : "bg-muted"}`}>
                  <LogOut className={`h-8 w-8 ${isCheckedOut ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className="text-sm font-medium text-foreground">Check Out</p>
                {isCheckedOut && currentToday?.checkOut ? (
                  <p className="text-lg font-bold text-primary">{currentToday.checkOut}</p>
                ) : isCheckedIn ? (
                  <Button onClick={handleCheckOut} variant="outline" className="gap-2 bg-transparent"><LogOut className="h-4 w-4" />Check Out Now</Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Check in first</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2"><Label>Remarks (optional)</Label><Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="E.g., traffic delay, will leave early" /></div>
            {currentToday && (
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1"><p className="text-sm font-medium text-foreground">Verification Status</p><p className="text-xs text-muted-foreground">Your attendance will be reviewed by the principal/admin</p></div>
                <Badge className={currentToday.verificationStatus === "approved" ? "bg-primary/15 text-primary border-primary/20" : currentToday.verificationStatus === "rejected" ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-chart-3/15 text-chart-3 border-chart-3/20"}>
                  {currentToday.verificationStatus.charAt(0).toUpperCase() + currentToday.verificationStatus.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Attendance History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Status</TableHead><TableHead>Verification</TableHead><TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-sm font-medium text-foreground">{record.date}</TableCell>
                  <TableCell className="text-sm">{record.checkIn || "---"}</TableCell>
                  <TableCell className="text-sm">{record.checkOut || "---"}</TableCell>
                  <TableCell>
                    <Badge className={record.status === "present" ? "bg-primary/15 text-primary border-primary/20" : record.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : record.status === "on-leave" ? "bg-accent/15 text-accent border-accent/20" : "bg-destructive/15 text-destructive"}>
                      {record.status === "on-leave" ? "On Leave" : record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={record.verificationStatus === "approved" ? "bg-primary/15 text-primary border-primary/20" : record.verificationStatus === "rejected" ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-chart-3/15 text-chart-3 border-chart-3/20"}>
                      {record.verificationStatus.charAt(0).toUpperCase() + record.verificationStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.remarks ?? "---"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Attendance Camera ──────────────────────────────────────── */
function AttendanceCamera() {
  const { attendance, setAttendance, addToast } = useAppState()
  const [isActive, setIsActive] = useState(false)
  const [selectedClass, setSelectedClass] = useState("cs301")
  const [recognizedStudents, setRecognizedStudents] = useState<{ name: string; id: string; status: "recognized" | "unrecognized" }[]>([])

  const startSession = () => {
    setIsActive(true)
    setRecognizedStudents([])
    const students = [
      { name: "Alex Thompson", id: "S001", status: "recognized" as const },
      { name: "Maria Garcia", id: "S002", status: "recognized" as const },
      { name: "Unknown", id: "---", status: "unrecognized" as const },
      { name: "David Kim", id: "S005", status: "recognized" as const },
    ]
    students.forEach((s, i) => {
      setTimeout(() => setRecognizedStudents((prev) => [...prev, s]), (i + 1) * 1500)
    })
  }

  const stopSession = () => {
    setIsActive(false)
    const recognized = recognizedStudents.filter((s) => s.status === "recognized")
    recognized.forEach((s) => {
      const exists = attendance.find((a) => a.studentId === s.id && a.date === "2026-02-06" && a.subject === "Data Structures")
      if (!exists) {
        setAttendance((prev) => [...prev, {
          id: `AT${Date.now()}-${s.id}`,
          studentId: s.id,
          studentName: s.name,
          date: "2026-02-06",
          status: "present",
          subject: "Data Structures",
          markedBy: "F001",
          method: "face-recognition",
        }])
      }
    })
    addToast({ title: "Session Complete", description: `${recognized.length} students marked present via face recognition.`, variant: "success" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Mark Class Attendance</h3><p className="text-sm text-muted-foreground">Use face recognition to mark student attendance</p></div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cs301">CS-301</SelectItem>
            <SelectItem value="cs302">CS-302</SelectItem>
            <SelectItem value="ma201">MA-201</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-lg bg-foreground/5">
              {isActive ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative"><Video className="h-16 w-16 animate-pulse text-primary" /><div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-destructive" /></div>
                  <p className="text-sm font-medium text-foreground">Camera Active - Scanning Faces</p>
                  <p className="text-xs text-muted-foreground">{recognizedStudents.filter((s) => s.status === "recognized").length} students recognized</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3"><Camera className="h-16 w-16 text-muted-foreground" /><p className="text-sm text-muted-foreground">Camera is not active</p></div>
              )}
            </div>
            <div className="flex gap-2 p-4">
              {!isActive ? (
                <Button onClick={startSession} className="gap-2"><Camera className="h-4 w-4" />Start Session</Button>
              ) : (
                <Button variant="destructive" onClick={stopSession} className="gap-2"><XCircle className="h-4 w-4" />Stop & Save</Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-base">Detection Log</CardTitle><CardDescription>Real-time recognition results</CardDescription></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {recognizedStudents.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No detections yet. Start the camera session.</p>
              ) : recognizedStudents.map((student, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  {student.status === "recognized" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> : <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
                  <div className="flex-1"><p className="text-sm font-medium text-card-foreground">{student.name}</p><p className="text-xs text-muted-foreground">ID: {student.id}</p></div>
                  <Badge className={student.status === "recognized" ? "bg-primary/15 text-primary border-primary/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                    {student.status === "recognized" ? "Marked" : "Unknown"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─── Class Attendance Records ───────────────────────────────── */
function FacultyAttendanceRecords() {
  const { attendance } = useAppState()
  const [dateFilter, setDateFilter] = useState("2026-02-06")
  const filteredRecords = attendance.filter((r) => r.date === dateFilter && r.markedBy === "F001")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Class Attendance Records</h3><p className="text-sm text-muted-foreground">View student attendance for your classes</p></div>
        <div className="flex gap-2">
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
          <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Student ID</TableHead><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No records found for this date</TableCell></TableRow>
              ) : filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.studentId}</TableCell>
                  <TableCell className="font-medium text-foreground">{record.studentName}</TableCell>
                  <TableCell>{record.subject}</TableCell>
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

/* ─── Faculty Assignments ────────────────────────────────────── */
function FacultyAssignments() {
  const { assignments, setAssignments, addToast } = useAppState()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newAssign, setNewAssign] = useState({ title: "", subject: "", dueDate: "", description: "" })

  const handleAdd = () => {
    if (!newAssign.title || !newAssign.subject) return
    setAssignments((prev) => [...prev, { id: `AS${Date.now()}`, ...newAssign, status: "pending" as const, createdBy: "F001" }])
    setNewAssign({ title: "", subject: "", dueDate: "", description: "" })
    setIsAddOpen(false)
    addToast({ title: "Assignment Created", description: `"${newAssign.title}" has been posted.`, variant: "success" })
  }

  const handleDelete = (id: string) => {
    const a = assignments.find((a) => a.id === id)
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    addToast({ title: "Assignment Deleted", description: `"${a?.title}" has been removed.`, variant: "destructive" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Assignments</h3><p className="text-sm text-muted-foreground">Create and manage assignments</p></div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New Assignment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Assignment</DialogTitle><DialogDescription>Add a new assignment for students.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"><Label>Title</Label><Input value={newAssign.title} onChange={(e) => setNewAssign({ ...newAssign, title: e.target.value })} placeholder="Assignment title" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Subject</Label>
                  <Select value={newAssign.subject} onValueChange={(v) => setNewAssign({ ...newAssign, subject: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Data Structures">Data Structures</SelectItem>
                      <SelectItem value="Algorithms">Algorithms</SelectItem>
                      <SelectItem value="Linear Algebra">Linear Algebra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2"><Label>Due Date</Label><Input type="date" value={newAssign.dueDate} onChange={(e) => setNewAssign({ ...newAssign, dueDate: e.target.value })} /></div>
              </div>
              <div className="flex flex-col gap-2"><Label>Description</Label><Textarea value={newAssign.description} onChange={(e) => setNewAssign({ ...newAssign, description: e.target.value })} placeholder="Assignment details..." rows={3} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAdd} disabled={!newAssign.title || !newAssign.subject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{assignment.title}</CardTitle>
                <Badge variant="secondary" className={assignment.status === "pending" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : assignment.status === "submitted" ? "bg-primary/15 text-primary border-primary/20" : "bg-accent/15 text-accent border-accent/20"}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>{assignment.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{assignment.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /><span>Due: {assignment.dueDate}</span></div>
                <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => handleDelete(assignment.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Faculty Exams ──────────────────────────────────────────── */
function FacultyExams() {
  const { exams, setExams, addToast } = useAppState()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newExam, setNewExam] = useState({ subject: "", date: "", time: "", venue: "", type: "Mid-term" })

  const handleAdd = () => {
    if (!newExam.subject || !newExam.date) return
    setExams((prev) => [...prev, { id: `E${Date.now()}`, ...newExam }])
    setNewExam({ subject: "", date: "", time: "", venue: "", type: "Mid-term" })
    setIsAddOpen(false)
    addToast({ title: "Exam Scheduled", description: `${newExam.subject} ${newExam.type} has been scheduled.`, variant: "success" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Exam Schedules</h3><p className="text-sm text-muted-foreground">Create and manage examination schedules</p></div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Schedule Exam</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Schedule Exam</DialogTitle><DialogDescription>Add a new examination.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Subject</Label>
                <Select value={newExam.subject} onValueChange={(v) => setNewExam({ ...newExam, subject: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data Structures">Data Structures</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                    <SelectItem value="Linear Algebra">Linear Algebra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2"><Label>Date</Label><Input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} /></div>
                <div className="flex flex-col gap-2"><Label>Time</Label><Input value={newExam.time} onChange={(e) => setNewExam({ ...newExam, time: e.target.value })} placeholder="09:00 AM" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2"><Label>Venue</Label><Input value={newExam.venue} onChange={(e) => setNewExam({ ...newExam, venue: e.target.value })} placeholder="Hall A" /></div>
                <div className="flex flex-col gap-2">
                  <Label>Type</Label>
                  <Select value={newExam.type} onValueChange={(v) => setNewExam({ ...newExam, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Mid-term">Mid-term</SelectItem><SelectItem value="Final">Final</SelectItem><SelectItem value="Quiz">Quiz</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAdd} disabled={!newExam.subject || !newExam.date}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Venue</TableHead></TableRow></TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium text-foreground">{exam.subject}</TableCell>
                  <TableCell><Badge variant="secondary">{exam.type}</Badge></TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>{exam.venue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Faculty Notifications ──────────────────────────────────── */
function FacultyNotifications() {
  const { notifications, setNotifications, addToast } = useAppState()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState<"announcement" | "exam" | "assignment">("announcement")

  const handleSend = () => {
    if (!title || !message) return
    setNotifications((prev) => [{ id: `N${Date.now()}`, title, message, category, read: false, timestamp: new Date().toISOString() }, ...prev])
    addToast({ title: "Notification Sent", description: `"${title}" broadcast to students.`, variant: "success" })
    setTitle("")
    setMessage("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div><h3 className="text-lg font-semibold text-foreground">Send Notification</h3><p className="text-sm text-muted-foreground">Broadcast announcements to students</p></div>
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" /></div>
          <div className="flex flex-col gap-2"><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your notification message..." rows={4} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="announcement">Announcement</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="assignment">Assignment</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Target Class</Label>
              <Select defaultValue="all">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Classes</SelectItem><SelectItem value="cs301">CS-301</SelectItem><SelectItem value="cs302">CS-302</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSend} disabled={!title || !message} className="gap-2 self-start"><Send className="h-4 w-4" />Send Notification</Button>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Section Map & Export ───────────────────────────────────── */
export function FacultyDashboard({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "my-attendance": return <FacultySelfAttendance />
    case "attendance-camera": return <AttendanceCamera />
    case "attendance": return <FacultyAttendanceRecords />
    case "assignments": return <FacultyAssignments />
    case "exams": return <FacultyExams />
    case "notifications": return <FacultyNotifications />
    default: return <FacultyOverview />
  }
}

export const facultySectionTitles: Record<string, string> = {
  overview: "Faculty Dashboard",
  "my-attendance": "My Attendance",
  "attendance-camera": "Mark Class Attendance",
  attendance: "Class Attendance Records",
  assignments: "Assignments",
  exams: "Exam Schedules",
  notifications: "Send Notification",
}
