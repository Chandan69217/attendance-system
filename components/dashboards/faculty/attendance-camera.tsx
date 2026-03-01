"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera,CheckCircle2, XCircle,Video, Clock,} from "lucide-react"
import { Class, Lecture, User } from "@/lib/types"
import { getFacultyClass } from "@/service/classes.service"
import { endLecture, getLecture, startLecture } from "@/service/lecture.service"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, WEBSOCKET_API } from "@/lib/config"
import { useWebSocket } from "@/hooks/useWebSocket"
import { useFaceDetection } from "@/hooks/useFaceDetection"



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


  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const captureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [recognizedLog, setRecognizedLog] = useState<{ name: string; id: string; status: "Sending" | "Error" }[]>([])
  const hasTriggeredRef = useRef(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const { startDetection, faceDetected, detections, stopDetection } = useFaceDetection(videoRef, canvasRef)
  
  const handleStartClass = async () => {
    if (isClassStarting) return;

    setIsClassStarting(true);

    try {
      if (lecture) {
        const status = await endLecture(lecture.id);

        if (status) {
          setLecture(null);
          setIsClassStarted(false);
          stopCamera()
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

 

  // FACE RECOGNITION

  const handleMessage = useCallback((data: any) => {
      console.log({"Socket Response message:":data})
  
      setRecognizedLog((prev) => [
        ...prev.slice(-3),
        {
          id: data.message,
          name: data.data?.student_name ?? Date.now().toString(),
          status: data.status ? "Sending" : "Error",
        },
      ]);
  
      if (data.status) {
  
        if(data.data){
          const value = data.data
          const isMarked = value['isMarked']??false
          addToast({
            title: !isMarked ? `Attendance already for ${value['student_name']}` :`Attendance Marked for ${value['student_name']}`,
            description: `${data.message}`,
            variant: !isMarked ?"destructive" :"success",
          }); 
          hasTriggeredRef.current = false
        }else{
          addToast({
            title: "Complete",
            description: `${data.message}`,
            variant: "success",
          });
          hasTriggeredRef.current = false
          // stopCamera()
          // stopDetection()
        }
      }else{
        hasTriggeredRef.current = false
      }
  
     
      
      
    }, [addToast]);
  
    const { send, connected } = useWebSocket({
      url: `${API_BASE_URL}${WEBSOCKET_API.STUDENT_FACE_ATTENDANCE}`,
      onMessage: handleMessage,
      onClose : ()=>{
        hasTriggeredRef.current=false
      }
    });
  
  
    useEffect(() => {
  
      if(!hasTriggeredRef.current){
        console.log("has triggered called")
        if (faceDetected && detections.length === 1) {
          hasTriggeredRef.current = true
          if (faceDetected) {
            captureFace()
          } 
        }
  
        if (detections.length > 1) {
          setRecognizedLog([{
            name: "Multiple Face Detected",
            id: Date.now().toString(),
            status: "Error"
          }])
        }
      }
    }, [faceDetected, detections,hasTriggeredRef])
  
  
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
          hasTriggeredRef.current = false
          startDetection()
      
        }
      } catch (err) {
        console.error("Camera error:", err)
        alert("Camera permission denied or not available")
      }
    }
  
    const stopCamera = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video) return;
  
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
  
      video.srcObject = null;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
  
        canvas.width = 0;
        canvas.height = 0;
      }
      stopDetection()
      hasTriggeredRef.current=false
      setIsCameraOn(false);
    };
  
  
    const captureFace = () => {
  
      if (!connected) return
      if (!isCameraOn) return
  
      const video = videoRef.current
    
      const canvas = captureCanvasRef.current
      if (!video || !canvas) return
  
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
  
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)
  
      const image = canvas.toDataURL("image/png",0.7)
      const base64 = image.split(",")[1]
  
      if(connected){
        
        setRecognizedLog((prev) => [
          ...prev,
          {
            id: "start marking attendance",
            name: lecture?.class_name ?? Date.now().toString(),
            status: "Sending",
          },
        ]);
        send({ image: base64,
          lecture_id: lecture?.id
        })
      }
    
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

          // FACE RECOGNITION

           <div className="grid gap-6 lg:grid-cols-5">
          
                   {/* camera card  */}
                  <Card className="lg:col-span-3">
                    <CardContent className="p-0">
                      <div className="relative aspect-video  overflow-hidden rounded-t-lg bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`absolute inset-0 h-full w-full object-cover ${isCameraOn ? "block" : "hidden"
                            }`}
                        />
          
                        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          
                        {!isCameraOn && (
                          <div className="flex h-full items-center justify-center">
                            <div className="flex flex-col items-center gap-3"><Camera className="h-16 w-16 text-muted-foreground" /><p className="text-sm text-muted-foreground">Camera is not active</p></div>
                          </div>
                        )}
          
                        <canvas ref={captureCanvasRef} className="hidden" />
          
                      </div>
                    </CardContent>
          
                    <div className="flex gap-2 p-4 justify-between">
                      {!isCameraOn ? (
                        <Button disabled = {!connected}onClick={startCamera} className="gap-2">
                          <Camera className="h-4 w-4" /> Start Recognizing
                        </Button>
                      ) : (
                        <>
                          <Button variant="destructive" onClick={stopCamera} className="gap-2">
                            <XCircle className="h-4 w-4" /> Stop Recognizing
                          </Button>
                        </>
                      )}
          
                    </div>
                  </Card>
          
                       {/* log details card */}
                   <Card className="lg:col-span-2">
                            <CardHeader className="pb-3"><CardTitle className="text-base">Detection Log</CardTitle><CardDescription>Real-time recognition results</CardDescription></CardHeader>
                            <CardContent>
                              <div className="flex flex-col gap-2">
                                {recognizedLog.length === 0 ? (
                                  <p className="py-8 text-center text-sm text-muted-foreground">No detections yet. Start the camera session.</p>
                                ) : recognizedLog.map((student, i) => (
                                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                                    {student.status === "Sending" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> : <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
                                    <div className="flex-1"><p className="text-sm font-medium text-card-foreground">{student.name}</p><p className="text-xs text-muted-foreground">{student.id}</p></div>
                                    <Badge className={student.status === "Sending" ? "bg-primary/15 text-primary border-primary/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                                      {student.status === "Sending" ? "success" : "Failed"}
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


