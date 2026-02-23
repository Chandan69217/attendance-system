import React, { useEffect, useMemo } from "react"
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
import { AttendanceRecord, Lecture } from "@/lib/types"
import { getLecture } from "@/service/lecture.service"
import { LiveDateTime } from "@/lib/live-datetime"
import { CircularLoader } from "@/components/ui/circular-loader"
import { formatDateTime } from "@/lib/utils"
import { formatTo12Hour } from "@/lib/format-to-12hours"
import { getStudentAttendance } from "@/service/attendance.service"





export function StudentMarkAttendance() {
  const { user } = useAuth()
  const { addToast } = useAppState()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [isMarking, setIsMarking] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isMarked, setIsMarked] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const todayDate = new Date().toLocaleDateString("en-CA")
  const [selectedLecture,setSelectedLecture] = useState<string>()
  const markedSubjects = useMemo(() => {
    return attendance
      .filter(
        (a) =>
          a.student_id === (user?.id ?? "")
      )
      .map((a) => a.subject_id)
  }, [attendance, user?.id, todayDate])


  const [todayClasses,setTodayClasses] = useState<Lecture[]>([])

  const getTodayLectures = async () => {
    setIsLoading(true)
    setAttendance(await getStudentAttendance(user?.id, todayDate))
    setTodayClasses(await getLecture({ student_id: user?.id }))
    setIsLoading(false)
    
  }

  useEffect(()=>{
    
     getTodayLectures()
   
  }, [])
  
  const handleMarkAttendance = async() => {
    setIsMarking(false)
    setIsMarked(true)
    await getTodayLectures()
    addToast({ title: "Attendance Marked", description: `Your attendance for ${selectedSubject} has been recorded.`, variant: "success" })
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

      
      <FaceAuthDialog
        remarks=""
        selectedUser={user!}
        open={isMarking}
        lecture_id={selectedLecture}
        onVerify={(v) => {
          console.log(v)
          if (v && v.status) {
            handleMarkAttendance()
          }
        }}
        onClose={setIsMarking} 
      />

      {isMarked && (
        <Card className="border-primary/30 bg-primary/[0.03]">
          <CardContent className="flex items-center gap-4 p-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <div><p className="text-sm font-semibold text-foreground">Attendance Marked Successfully</p><p className="text-xs text-muted-foreground">Your attendance for {selectedSubject} has been recorded.</p></div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">{"Today's Classes"} - {<LiveDateTime/>}</CardTitle><CardDescription>Tap the button to mark your attendance for each class</CardDescription></CardHeader>
        <CardContent>
          {
            isLoading? (<CircularLoader/>):(
               <div className="flex flex-col gap-3">
            {todayClasses.map((cls) => {
              const alreadyMarked = markedSubjects.includes(cls.subject_id)
              return (
                <div key={cls.id} className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${alreadyMarked ? "border-primary/20 bg-primary/[0.02]" : "border-border"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${alreadyMarked ? "bg-primary/10" : "bg-muted"}`}>
                      <BookOpen className={`h-6 w-6 ${alreadyMarked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cls.subject_name}</p>
                      <p className="text-xs text-muted-foreground">{formatTo12Hour(cls.start_time)} | {cls.class_name}</p>
                      <p className="text-xs text-muted-foreground">{cls.faculty_name}</p>
                    </div>
                  </div>
                  {alreadyMarked ? (
                    <Badge className="bg-primary/15 text-primary border-primary/20 self-start sm:self-auto"><CheckCircle2 className="mr-1 h-3 w-3" />Marked</Badge>
                  ) : (
                    <Button onClick={() => {
                        if (cls.status === "scheduled") {
                          addToast({
                            title: "Attendance Not Marked",
                            description: "Class is not started yet.",
                            variant: "destructive"
                          })
                          return
                        }

                        if (cls.status === "closed") {
                          addToast({
                            title: "Attendance Not Marked",
                            description: "Class is completed. You cannot mark attendance.",
                            variant: "destructive"
                          })
                          return
                        }

                        setSelectedSubject(cls.subject_name);
                        setSelectedLecture(cls.id)
                        setIsMarking(true)

                    }} disabled={isMarking} className="gap-2 self-start sm:self-auto" size="sm"><Fingerprint className="h-4 w-4" />Mark Attendance</Button>
                  )}
                </div>
              )
            })}
          </div>
            )
          }
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