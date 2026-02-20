import { User } from "@/lib/types"
import { useCallback, useEffect, useRef, useState } from "react"
import { useWebSocket } from "@/hooks/useWebSocket"
import { API_BASE_URL, WEBSOCKET_API } from "@/lib/config"
import { useFaceDetection } from "@/hooks/useFaceDetection"
import { getLocation } from "@/lib/get-loacation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {  CheckCircle2, XCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"



interface FaceAuthDialogProps {
    open: boolean
    onClose: (open: boolean) => void
    onVerify: (params: { status: boolean; message: string }) => void
    selectedUser: User
    remarks:string
}



export function FaceAuthDialog({
    open,
    onClose,
    onVerify,
    selectedUser,
    remarks
}: FaceAuthDialogProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvasCaptureRef = useRef<HTMLCanvasElement>(null)
    const { startDetection, stopDetection, faceDetected, detections } = useFaceDetection(videoRef, canvasRef)
    const [recognizedLog, setRecognizedLog] = useState<{ name: string; id: string; status: "Sending" | "Error" }[]>([])
    const hasTriggeredRef = useRef(false)
    const [shouldReconnect, setShouldReconnect] = useState(true);
    const [error, setError] = useState("");

    const handleMessage = useCallback((data: any) => {
        console.log({"socket data" : data})
        setShouldReconnect(data.status);

        if (!data.status) {
            setError(data.message);
            stopDetection();
            stopCamera();
        }

        if (data.data && data.data.isMarked) {
            const d = data.data;

            onVerify({
                status: d.status ?? false,
                message: d.message ?? ""
            });

            stopDetection();
            stopCamera();
            onClose(false);
            return
        }else{

            hasTriggeredRef.current = false;
        }


        setRecognizedLog((prev) => [
            ...prev.slice(-1),
            {
                id: data.message,
                name: data.data?.name ?? Date.now().toString(),
                status: data.status ? "Sending" : "Error",
            },
        ]);

    }, [stopDetection, onVerify, onClose]);




    const { send, connected } = useWebSocket({
        url: `${API_BASE_URL}${WEBSOCKET_API.MARK_ATTENDANCE}/${selectedUser.id}`,
        onMessage: handleMessage,
        autoReconnect: shouldReconnect,
    });


    useEffect(() => {
        if (!open) return;

        if (!hasTriggeredRef.current) {

            if (faceDetected && detections.length === 1 && connected) {
                hasTriggeredRef.current = true;
                markAttendace();
            }

            if (detections.length > 1) {
                setRecognizedLog((prev) => [
                    ...prev.slice(-1),
                    {
                        name: "Multiple Face Detected",
                        id: Date.now().toString(),
                        status: "Error"
                    }
                ]);
            }
        }
    }, [faceDetected, detections, connected, open]);


    // Start camera
    useEffect(() => {
        if (!open) return

        if (!error) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    if (!videoRef.current) return

                    videoRef.current.srcObject = stream

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play()

                        console.log("start detection called")
                        startDetection()
                    }
                })
        }

    }, [open])


    useEffect(() => {
        if (open) {
            setError("");
            setRecognizedLog([]);
            setShouldReconnect(true);
            stopDetection()
            stopCamera()
            hasTriggeredRef.current = false;
        }
    }, [open]);




    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream | null
        if (!stream) return

        stream.getTracks().forEach((track) => track.stop())
        if (videoRef.current) videoRef.current.srcObject = null
    }


    const markAttendace = async () => {
        if (!videoRef.current || !canvasCaptureRef.current) return;

        try {

            setRecognizedLog((prev) => [
                ...prev.slice(-1),
                {
                    name: "Start recognition",
                    id: Date.now().toString(),
                    status: "Sending"
                }
            ]);
            const video = videoRef.current;
            const canvas = canvasCaptureRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0);

            const base64 = canvas
                .toDataURL("image/jpeg", 0.7)
                .split(",")[1];

            const { latitude, longitude } = await getLocation();

            send({
                image: base64,
                latitude,
                longitude,
                remarks
            });

        } catch (err) {
            setError("Location permission required");
            stopCamera();
            stopDetection();
        }
    };





    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Face Authentication</DialogTitle>
                    <DialogDescription>
                        Align your face inside the frame and capture
                    </DialogDescription>
                </DialogHeader>
                {

                    error ? (
                        <div className="flex flex-col items-center justify-center py-16" >
                            <p className="text-red-600 font-semibold text-lg text-center">
                                {error}
                            </p>
                        </div>
                    ) : (

                        <>
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

                            <div className="flex flex-col lg:flex-row gap-6 items-start">

                                <div className="flex flex-col items-start ">
                                    <div className="relative flex">

                                            <div className="relative h-56 w-56">

                                                {/* Video */}
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    className="absolute inset-0 h-full w-full rounded-xl object-cover border"
                                                />

                                                {/* Canvas Overlay */}
                                                <canvas
                                                    ref={canvasRef}
                                                    className="absolute inset-0 h-full w-full rounded-xl object-cover pointer-events-none"
                                                />
                                                <canvas ref={canvasCaptureRef} className="hidden">

                                                </canvas>

                                                {/* Face Frame Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="h-40 w-40 rounded-full border-2 border-primary" />
                                                </div>

                                            </div>

                                    </div>
                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                        Ensure good lighting • Remove mask or glasses
                                    </p>
                                </div>

                                <Card className="h-56 w-80 lg:w-96">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Detection Log</CardTitle>
                                        <CardDescription>
                                            Real-time recognition results
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="h-[140px] overflow-y-auto">
                                        <div className="flex flex-col gap-2">
                                            {recognizedLog.length === 0 ? (
                                                <p className="py-4 text-center text-sm text-muted-foreground">
                                                    No detections yet.
                                                </p>
                                            ) : (
                                                recognizedLog.map((student, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 rounded-lg border border-border p-2"
                                                    >
                                                        {student.status === "Sending" ? (
                                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                                                        )}

                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">
                                                                {student.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {student.id}
                                                            </p>
                                                        </div>

                                                        <Badge
                                                            className={
                                                                student.status === "Sending"
                                                                    ? "bg-primary/15 text-primary"
                                                                    : "bg-destructive/15 text-destructive"
                                                            }
                                                        >
                                                            {student.status === "Sending"
                                                                ? "Success"
                                                                : "Failed"}
                                                        </Badge>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>



                            </div>
                        </>
                    )
                }

            </DialogContent>
        </Dialog>
    )
}