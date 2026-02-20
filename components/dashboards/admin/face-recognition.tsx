"use client"


import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAppState } from "@/lib/app-state";
import { User } from "@/lib/types";
import {  Camera, CheckCircle2, Loader2, Search,  XCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getFilterUsers } from "@/service/users.service";
import { API_BASE_URL, WEBSOCKET_API } from "@/lib/config";


export function FaceRecognition() {

  const [isCameraOn, setIsCameraOn] = useState(false)
  const { addToast } = useAppState()
  const [users,setUsers] = useState<User[]>([])
  const [userLoading,setUserLoading] = useState<boolean>(true)
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
  const captureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [recognizedLog, setRecognizedLog] = useState<{ name: string; id: string; status: "Sending" | "Error" }[]>([])
  const [isFaceMatched,setFaceMatched] = useState(false)
  const hasTriggeredRef = useRef(false)

  // Load Users
useEffect(()=>{
  const loadUsers = async ()=>{
    setUsers(await getFilterUsers())
    setUserLoading(false)
  }
  loadUsers()
  return () => {
    stopCamera();
  };
},[])  

///////////// Face Recognition Code //////////////


  const handleMessage = useCallback((data: any) => {
    console.log({"Socket Response message:":data})
   
    const timestamp = Date.now();

    setRecognizedLog((prev) => [
      ...prev.slice(-3),
      {
        id: data.message,
        name: data.data?.name ?? Date.now().toString(),
        status: data.status ? "Sending" : "Error",
      },
    ]);

    if (data.status) {

      if(data.data){
        setFaceMatched(true)
        setSelectedUser(data.data)
        addToast({
          title: "Face Detected",
          description: `${data.message}`,
          variant: "success",
        });
      }else{
        addToast({
          title: "Complete",
          description: `${data.message}`,
          variant: "success",
        });
        hasTriggeredRef.current = false
        stopCamera()
        stopDetection()
      }
    }else{
      hasTriggeredRef.current = false
    }

   
    
    
  }, [addToast, selectedUser,isFaceMatched]);


  const { send, connected } = useWebSocket({
    url: `${API_BASE_URL}${WEBSOCKET_API.FACE_RECOGNITION}`,
    onMessage: handleMessage,
    onClose : ()=>{
      hasTriggeredRef.current=false
    }
  });


  

  const {startDetection,faceDetected,detections,stopDetection} = useFaceDetection(videoRef,canvasRef)


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
    setFaceMatched(false)
    setSelectedUser(undefined)
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
      

      const timestamp = Date.now();
      setRecognizedLog((prev) => [
        ...prev,
        {
          id: "start face recognition",
          name: selectedUser?.name ?? Date.now().toString(),
          status: "Sending",
        },
      ]);
      send({ image: base64,
        user_id: selectedUser?.id
      })
    }
  
  }


  useEffect(() => {
    if (!searchTerm.trim()) {
      setSelectedUser(undefined)
    }
  }, [searchTerm])

  return (
    <div className="flex flex-col gap-6">

      {/* serach card */}
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
                        {userLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : (
                          "No users found"
                        )}
                      </div>

                  )}

                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

          {/* selected user card */}
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
                    Joined on {selectedUser.join_date}
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
                {/* <Button onClick={captureFace} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Capture
                </Button> */}
                <Button variant="destructive" onClick={stopCamera} className="gap-2">
                  <XCircle className="h-4 w-4" /> Stop Recognizing
                </Button>
              </>
            )}

            {
              isFaceMatched && (
                <div className="gap-2 flex">
                  <Button onClick={()=>{
                    setFaceMatched(false)
                    setSelectedUser(undefined)
                    send({
                      confirm:false
                    })
                    hasTriggeredRef.current = false
                  }} variant={"outline"} className="gap-2">
                    <XCircle className="h-4 w-4" /> Cancel
                </Button>
                  <Button variant="default" onClick={()=>{
                    setFaceMatched(false)
                    setSelectedUser(undefined)
                    send({
                      confirm:true
                    })
                  }} className="gap-2">
                    <XCircle className="h-4 w-4" /> Confirm & Update
                  </Button>
                </div>
              )
            }
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

    </div>
  )
}
