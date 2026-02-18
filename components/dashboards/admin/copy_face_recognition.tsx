// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAppState } from "@/lib/app-state";
// import { Badge, Camera, CheckCircle2, Video, XCircle } from "lucide-react";
// import { useState } from "react";

// export function FaceRecognition() {
//   const { attendance, setAttendance, addToast } = useAppState()
//   const [isActive, setIsActive] = useState(false)
//   const [selectedClass, setSelectedClass] = useState("cs301")
//   const [recognizedStudents, setRecognizedStudents] = useState<{ name: string; id: string; status: "recognized" | "unrecognized" }[]>([])

//   const startSession = () => {
//     setIsActive(true)
//     setRecognizedStudents([])
//     const students = [
//       { name: "Alex Thompson", id: "S001", status: "recognized" as const },
//       { name: "Maria Garcia", id: "S002", status: "recognized" as const },
//       { name: "Unknown", id: "---", status: "unrecognized" as const },
//       { name: "David Kim", id: "S005", status: "recognized" as const },
//     ]
//     students.forEach((s, i) => {
//       setTimeout(() => setRecognizedStudents((prev) => [...prev, s]), (i + 1) * 1500)
//     })
//   }

//   const stopSession = () => {
//     setIsActive(false)
//     const recognized = recognizedStudents.filter((s) => s.status === "recognized")
//     recognized.forEach((s) => {
//       const exists = attendance.find((a) => a.studentId === s.id && a.date === "2026-02-06" && a.subject === "Data Structures")
//       if (!exists) {
//         setAttendance((prev) => [...prev, {
//           id: `AT${Date.now()}-${s.id}`,
//           studentId: s.id,
//           studentName: s.name,
//           date: "2026-02-06",
//           status: "present",
//           subject: "Data Structures",
//           markedBy: "F001",
//           method: "face-recognition",
//         }])
//       }
//     })
//     addToast({ title: "Session Complete", description: `${recognized.length} students marked present via face recognition.`, variant: "success" })
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div><h3 className="text-lg font-semibold text-foreground">Mark Class Attendance</h3><p className="text-sm text-muted-foreground">Use face recognition to mark student attendance</p></div>
//         <Select value={selectedClass} onValueChange={setSelectedClass}>
//           <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="cs301">CS-301</SelectItem>
//             <SelectItem value="cs302">CS-302</SelectItem>
//             <SelectItem value="ma201">MA-201</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid gap-6 lg:grid-cols-5">
//         <Card className="lg:col-span-3">
//           <CardContent className="p-0">
//             <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-lg bg-foreground/5">
//               {isActive ? (
//                 <div className="flex flex-col items-center gap-3">
//                   <div className="relative"><Video className="h-16 w-16 animate-pulse text-primary" /><div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-destructive" /></div>
//                   <p className="text-sm font-medium text-foreground">Camera Active - Scanning Faces</p>
//                   <p className="text-xs text-muted-foreground">{recognizedStudents.filter((s) => s.status === "recognized").length} students recognized</p>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center gap-3"><Camera className="h-16 w-16 text-muted-foreground" /><p className="text-sm text-muted-foreground">Camera is not active</p></div>
//               )}
//             </div>
//             <div className="flex gap-2 p-4">
//               {!isActive ? (
//                 <Button onClick={startSession} className="gap-2"><Camera className="h-4 w-4" />Start Session</Button>
//               ) : (
//                 <Button variant="destructive" onClick={stopSession} className="gap-2"><XCircle className="h-4 w-4" />Stop & Save</Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="lg:col-span-2">
//           <CardHeader className="pb-3"><CardTitle className="text-base">Detection Log</CardTitle><CardDescription>Real-time recognition results</CardDescription></CardHeader>
//           <CardContent>
//             <div className="flex flex-col gap-2">
//               {recognizedStudents.length === 0 ? (
//                 <p className="py-8 text-center text-sm text-muted-foreground">No detections yet. Start the camera session.</p>
//               ) : recognizedStudents.map((student, i) => (
//                 <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
//                   {student.status === "recognized" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> : <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
//                   <div className="flex-1"><p className="text-sm font-medium text-card-foreground">{student.name}</p><p className="text-xs text-muted-foreground">ID: {student.id}</p></div>
//                   <Badge className={student.status === "recognized" ? "bg-primary/15 text-primary border-primary/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
//                     {student.status === "recognized" ? "Marked" : "Unknown"}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAppState } from "@/lib/app-state";
import { User } from "@/lib/types";
import {  Camera, CheckCircle2, Search, Video, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge"

export function FaceRecognition() {

  const [selectedClass, setSelectedClass] = useState("cs301")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [face, setFaces] = useState<
    { id: string; image: string; status: "pending" | "saved" }
  >()

  const { users, addToast, facultyAttendance, } = useAppState()
  const [searchTerm, setSearchTerm] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const filteredUsers = users.filter((u) => ((u.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
    (u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
    (u.id.toLowerCase() === searchTerm.trim().toLowerCase()))
  )
  const [selectedUser, setSelectedUser] = useState<User>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
        }
        setIsCameraOn(true)
      }
    } catch (err) {
      console.error("Camera error:", err)
      alert("Camera permission denied or not available")
    }
  }


  const stopCamera = () => {
    const video = videoRef.current
    if (!video) return

    const stream = video.srcObject as MediaStream
    stream?.getTracks().forEach((t) => t.stop())
    video.srcObject = null
    setIsCameraOn(false)
  }


  const captureFace = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    ctx?.drawImage(video, 0, 0)

    const image = canvas.toDataURL("image/png")
    setCapturedImage(image)

    setFaces(
      { id: `face-${Date.now()}`, image, status: "pending" },
    )
    stopCamera()
  }


  useEffect(() => {
    if (!searchTerm.trim()) {
      setSelectedUser(undefined)
    }
  }, [searchTerm])

  return (
    <div className="flex flex-col gap-6">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:items-center">
        <div className="sm:col-span-3">
          <h3 className="text-lg font-semibold text-foreground">Face Recognition</h3>
          <p className="text-sm text-muted-foreground">Use face recognition to add update face</p>
        </div>
        <div ref={wrapperRef} className="relative sm:col-span-2  ">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowOverlay(true)
            }}
            onFocus={() => setShowOverlay(true)}
          />

          {showOverlay && searchTerm.trim() && (
            <div className="absolute top-full left-0 right-0 z-20 mt-2">
              <Card className="shadow-md border">
                <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    <Table>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => {
                              setSelectedUser(user)
                              setSearchTerm(user.name)
                              setShowOverlay(false)
                            }}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>

                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      No users found
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-4 max-h-[100px]">
          {selectedUser ? (
            <div className="flex flex-row gap-6">

              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{selectedUser.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="gap-2">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span  className="rounded-md bg-primary/10 px-2 py-1 text-primary">
                    {selectedUser.role}
                  </span>

                  {selectedUser.department && (
                    <Badge className="rounded-md bg-muted px-2 py-1" variant={"secondary"}>
                      {selectedUser.department}
                    </Badge>
                  )}

                  {selectedUser.class && (
                    <Badge className="rounded-md bg-muted px-2 py-1" variant={"secondary"}>
                      {selectedUser.class}
                    </Badge>
                  )}

                </div>

                <Badge className="rounded-md px-2 py-1 mt-2" variant={"secondary"}>
                  <p>
                    Joined on {selectedUser.joinDate}
                  </p>
                </Badge>

              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No user selected
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">

        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="relative aspect-video min-h-[300px] overflow-hidden rounded-t-lg bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 h-full w-full object-cover ${isCameraOn ? "block" : "hidden"
                  }`}
              />

              {!isCameraOn && (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3"><Camera className="h-16 w-16 text-muted-foreground" /><p className="text-sm text-muted-foreground">Camera is not active</p></div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          </CardContent>

          <div className="flex gap-2 p-4">
            {!isCameraOn ? (
              <Button onClick={startCamera} className="gap-2">
                <Camera className="h-4 w-4" /> Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={captureFace} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Capture
                </Button>
                <Button variant="destructive" onClick={stopCamera} className="gap-2">
                  <XCircle className="h-4 w-4" /> Stop
                </Button>
              </>
            )}
          </div>
        </Card>


        <Card className="lg:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-base">Detection Log</CardTitle><CardDescription>Real-time recognition results</CardDescription></CardHeader>
          <CardContent >
            {face === undefined ? (
                <p className="py-24 text-center text-sm text-muted-foreground">
                  No face captured yet
                </p>
            ) : (
              <div
                key={face.id}
                className="flex flex-col items-center gap-3"
              >
                <img
                  src={face.image}
                  alt="Captured face"
                  className="rounded-md object-cover max-h-[200px]"
                />

                <div className="flex flex-col flex-1 items-center">
                  <p className="text-sm font-medium">Captured Face</p>
                  <p className="text-xs text-muted-foreground">Ready to save</p>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => {

                      // handle face capture

                      setFaces(undefined)
                      addToast({
                        title: "Face Capture Successful",
                        description: "The face has been captured and stored successfully.",
                        variant: "success",
                      })
                    }

                    }
                  >
                    Save
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFaces(undefined)
                      startCamera()
                    }

                    }
                  >
                    Retake
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

    </div>
  )
}



// <Card className="lg:col-span-3">
//   <CardContent className="p-0">
//     <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-lg bg-foreground/5">
//       {isActive ? (
//         <div className="flex flex-col items-center gap-3">
//           <div className="relative"><Video className="h-16 w-16 animate-pulse text-primary" /><div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-destructive" /></div>
//           <p className="text-sm font-medium text-foreground">Camera Active - Scanning Faces</p>
//           <p className="text-xs text-muted-foreground">{recognizedStudents.filter((s) => s.status === "recognized").length} students recognized</p>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center gap-3"><Camera className="h-16 w-16 text-muted-foreground" /><p className="text-sm text-muted-foreground">Camera is not active</p></div>
//       )}
//     </div>
//     <div className="flex gap-2 p-4">
//       {!isActive ? (
//         <Button onClick={startSession} className="gap-2"><Camera className="h-4 w-4" />Start Session</Button>
//       ) : (
//         <Button variant="destructive" onClick={stopSession} className="gap-2"><XCircle className="h-4 w-4" />Stop & Save</Button>
//       )}
//     </div>
//   </CardContent>
// </Card>