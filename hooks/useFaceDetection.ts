import { useEffect, useRef, useState } from "react"

export function useFaceDetection(
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) {
    const [faceapi, setFaceapi] = useState<any>(null)
    const [faceDetected, setFaceDetected] = useState(false)
    const [detections, setDetections] = useState<any[]>([])

    const recognitionInterval = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const load = async () => {
            const module = await import("@vladmandic/face-api")
            setFaceapi(module)
        }
        load()
    }, [])

    const loadModels = async () => {
        if (!faceapi) return

        const MODEL_URL = "/models"

        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ])
    }

    const startDetection = async () => {
        if (!faceapi) return

        await loadModels()
    
        if (recognitionInterval.current) return
        recognitionInterval.current = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return

            const video = videoRef.current
            const canvas = canvasRef.current

            const results = await faceapi
                .detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions({
                        inputSize: 512,
                        scoreThreshold: 0.7,
                    })
                )
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender()

            setDetections(results)
            setFaceDetected(results.length > 0)

            const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
            }

            canvas.width = displaySize.width
            canvas.height = displaySize.height

            faceapi.matchDimensions(canvas, displaySize)

            const resized = faceapi.resizeResults(results, displaySize)

            const ctx = canvas.getContext("2d")
            ctx?.clearRect(0, 0, canvas.width, canvas.height)

            faceapi.draw.drawDetections(canvas, resized)
            faceapi.draw.drawFaceLandmarks(canvas, resized)
            faceapi.draw.drawFaceExpressions(canvas, resized)
        }, 200)
    }

    const stopDetection = () => {
        if (recognitionInterval.current) {
            clearInterval(recognitionInterval.current)
            recognitionInterval.current = null
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
    }

    useEffect(() => {
        return () => {
            stopDetection()
        }
    }, [])

    return {
        startDetection,
        stopDetection,
        faceDetected,
        detections,
    }
}
