import { User } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"

interface FaceAuthDialogProps {
    open: boolean
    onClose: (open: boolean) => void
    onVerify: (isVarifyed: boolean) => void
    selectedUser: User
}

export function FaceAuthDialog({
    open,
    onClose,
    onVerify,
    selectedUser,
}: FaceAuthDialogProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [captured, setCaptured] = useState<string | null>(null)

    // Start camera
    useEffect(() => {
        if (!open) return

        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            })

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                tracks.forEach((t) => t.stop())
            }
        }
    }, [open])

    useEffect(() => {
        if (open) {
            setCaptured(null)
        }
    }, [open])


    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream | null
        if (!stream) return

        stream.getTracks().forEach((track) => track.stop())
        if (videoRef.current) videoRef.current.srcObject = null
    }


    const captureFace = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0)
        setCaptured(canvas.toDataURL("image/png"))
    }

    useEffect(() => {
        if (!open || captured) return;
        const timer = setTimeout(() => {
            captureFace()
            onClose(false)
            stopCamera()
            onVerify(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [open, captured])


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Face Authentication</DialogTitle>
                    <DialogDescription>
                        Align your face inside the frame and capture
                    </DialogDescription>
                </DialogHeader>

                {/* User Info */}
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {selectedUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <p className="text-sm font-medium">{selectedUser.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {selectedUser.email}
                            </p>
                        </div>

                        <Badge variant="secondary">{selectedUser.role}</Badge>
                    </CardContent>
                </Card>

                {/* Camera Area */}
                <div className="relative mt-4 flex justify-center">
                    {!captured ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="h-56 w-56 rounded-xl object-cover border"
                            />

                            {/* Face Frame Overlay */}
                            <div className="absolute h-40 w-40 rounded-full border-2 border-primary pointer-events-none" />
                        </>
                    ) : (
                        <img
                            src={captured}
                            className="h-56 w-56 rounded-xl object-cover border"
                        />
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <p className="text-xs text-center text-muted-foreground mt-2">
                    Ensure good lighting • Remove mask or glasses
                </p>

                {/* Actions */}
                {/* <div className="flex justify-end gap-2 mt-4">
          {!captured ? (
            <Button onClick={captureFace}>Capture</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setCaptured(null)}>
                Retake
              </Button>
              <Button
                onClick={() => {
                  // TODO: send `captured` to backend
                  onVerify(true)
                }}
              >
                Confirm
              </Button>
            </>
          )}
        </div> */}
            </DialogContent>
        </Dialog>
    )
}