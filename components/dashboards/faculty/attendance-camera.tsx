"use client"

import React, { useEffect } from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera,CheckCircle2, XCircle,Video, Clock,} from "lucide-react"
import { Class, Lecture } from "@/lib/types"
import { getFacultyClass } from "@/service/classes.service"
import { endLecture, getLecture, startLecture } from "@/service/lecture.service"
import { useAuth } from "@/lib/auth-context"



export function AttendanceCamera() {

  const { attendance, setAttendance, addToast } = useAppState()
  const [isActive, setIsActive] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [recognizedStudents, setRecognizedStudents] = useState<{ name: string; id: string; status: "recognized" | "unrecognized" }[]>([])
  const [isClassStarted, setIsClassStarted] = useState(false)
  const [classData,setClassData] = useState<Class[]>([])
  const [isClassLoading,setIsClassLoading] = useState(true)
  const [lecture,setLecture] = useState<Lecture|null>()
  const [isClassStarting,setIsClassStarting] = useState(false)
  const { user } = useAuth()


  const handleStartClass = async () => {
    if (isClassStarting) return;

    setIsClassStarting(true);

    try {
      if (lecture) {
        const status = await endLecture(lecture.id);

        if (status) {
          setLecture(null);
          setIsClassStarted(false);
        }
      } else {
        const data = await startLecture();

        if (data) {
          setLecture(data);
          setIsClassStarted(data.status === "active");
        }
      }
    } catch (error) {
      console.error("Error starting/ending class:", error);
    } finally {
      setIsClassStarting(false);
    }
  };

  useEffect(() => {
    const getClassData = async () => {
      const data = await getFacultyClass();
      const lecture = await getLecture({faculty_id:user?.id})
      if (Array.isArray(data) && data.length > 0) {
        setSelectedClass(data[0].id);
        setClassData(data);
      } else {
        setSelectedClass("");
        setClassData([]);
      }

      if(lecture.length>0){
        const data = lecture[0]
        if(data.status === 'active'){
          setIsClassStarted(true)
          setLecture(data)
        }
      }
      setIsClassLoading(false)
    };

    getClassData();
  }, []);

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
        <div className="flex felx-row gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classData.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={isClassLoading || isClassStarting} onClick={handleStartClass} variant={isClassStarted ? "destructive" : "default"}>
            {isClassStarted ? " End Class" : " Start Class"}
            
          </Button>
        </div>
      </div>
      {
        isClassStarted ? (
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
        ) : (<div className="flex items-center justify-center   px-4 py-20">
          <Card>
            
              <CardContent className="p-8 w-full max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
                  <Clock className="h-8 w-8 text-primary" />
                </div>


                <h3 className="text-xl font-semibold text-foreground">
                  Class Not Started
                </h3>


                <p className="text-sm text-muted-foreground mt-3">
                  Your class session hasn’t started yet.
                  Click below to begin the class and allow students to mark attendance.
                </p>


                <Button
                  className="mt-6 w-full"
                  size="lg"
                  disabled={isClassLoading || isClassStarting}
                  onClick={handleStartClass}
                >
                  {isClassLoading || isClassStarting ? "Loading..." :"Start Class"}
                </Button>
            </CardContent>
          </Card>
        </div>)
      }
    </div>
  )
  
}


