import React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   BookOpen, Fingerprint, MapPin, CheckCircle2, ScanFace,
} from "lucide-react"
import { FaceAuthDialog } from "@/components/face-recognition"





export function StudentMarkAttendance() {
  const { user } = useAuth()
  const { attendance, setAttendance, addToast } = useAppState()
  const [isMarking, setIsMarking] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isMarked, setIsMarked] = useState(false)
  const [markedSubjects, setMarkedSubjects] = useState<string[]>(() => {
    const myToday = attendance.filter((a) => a.studentId === (user?.id ?? "S001") && a.date === "2026-02-06")
    return myToday.map((a) => a.subject)
  })

  const [mode,setMode] = useState<'in'|'out'>('in')

  const todayClasses = [
    { id: "CL1", subject: "Data Structures", time: "09:00 AM - 10:00 AM", room: "Room 301", faculty: "Prof. James Carter" },
    { id: "CL2", subject: "Algorithms", time: "10:30 AM - 11:30 AM", room: "Room 302", faculty: "Prof. James Carter" },
    { id: "CL3", subject: "Linear Algebra", time: "02:00 PM - 03:00 PM", room: "Room 201", faculty: "Dr. Emily Chen" },
  ]

  const handleMarkAttendance = () => {
    setTimeout(() => {
      setIsMarking(false)
      setIsMarked(true)
      setMarkedSubjects((prev) => [...prev, selectedSubject])
      setAttendance((prev) => [...prev, {
        id: `AT${Date.now()}`,
        studentId: user?.id ?? "S001",
        studentName: user?.name ?? "Student",
        date: "2026-02-06",
        status: "present",
        subject: selectedSubject,
        markedBy: user?.id ?? "S001",
        method: "self-marked",
      }])
      addToast({ title: "Attendance Marked", description: `Your attendance for ${selectedSubject} has been recorded.`, variant: "success" })
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

      
      <FaceAuthDialog selectedUser={user!} open={isMarking} onVerify={(v) => {
        if (v) {
          if (mode === 'in') {
            handleMarkAttendance()
          }
        }
      }} onClose={setIsMarked} />

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
                    <Button onClick={() => {
                      setSelectedSubject(cls.subject);
                      setIsMarking(true)
                    }} disabled={isMarking} className="gap-2 self-start sm:self-auto" size="sm"><Fingerprint className="h-4 w-4" />Mark Attendance</Button>
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