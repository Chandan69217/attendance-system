"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2, Mail, Lock, EyeOff, Eye } from "lucide-react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { API_BASE_URL, AUTH_API } from "@/lib/config"


export default function ForgotPassword() {
    const router = useRouter()

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // 🔹 Send OTP
    const handleSendOtp = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
           
            const res = await fetch(`${API_BASE_URL}${AUTH_API.SEND_OTP}?email=${ email }`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.details || "Failed to send OTP")
           
            if(!data.status)
                setError(data.message)

            if (data.status){
                setSuccess(data.message)
                setStep(2)
            }
                
        } catch (err: any) {
            setError(err.message)
            console.log(err.message)
        } finally {
            setLoading(false)
        }
    }

    // 🔹 Verify OTP
    const handleVerifyOtp = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
           
            const res = await fetch(`${API_BASE_URL}${AUTH_API.VERIFY_OTP}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Invalid OTP")
            
            const message = data.message
            const status = data.status
            if(!status)
                setError(message)

            if (status){
                setSuccess(message)
                setStep(3)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // 🔹 Reset Password
    const handleResetPassword = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }

        setLoading(true)

        try {
            const res = await fetch(`${API_BASE_URL}${AUTH_API.CHANGE_PASSWORD}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email,new_password: password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Failed to reset password")

            const status = data.status
            const message = data.message
            if(!status){
                setError(message)
            }
            if(status){
                setSuccess(message)
            }
            
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-border shadow-lg">
            <CardHeader>
                <CardTitle>
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "Reset Password"}
                </CardTitle>
                <CardDescription>
                    {step === 1 && "Enter your registered email"}
                    {step === 2 && "Enter OTP sent to your email"}
                    {step === 3 && "Create a new password"}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 text-sm text-green-600 bg-green-100 rounded-lg">
                        {success}
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-card-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    className="pl-10"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                "Send OTP"
                            )}
                        </Button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="flex flex-col gap-2">

                            <Label htmlFor="otp" className="text-card-foreground">OTP</Label>
                            <InputOTP className="w-full" maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup className="w-full flex justify-between">
                                    {[...Array(6)].map((_, i) => (
                                        <InputOTPSlot className="rounded border" key={i} index={i} />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button className="w-full" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="text-card-foreground">New Password</Label>
                            <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                placeholder="new password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                
                            />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirm-password" className="text-card-foreground">Confirm Password</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                placeholder="confirm password"
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <Button className="w-full" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                )}

                {/* <div className="mt-6 text-center text-sm">
                                <Link href="#" className="text-primary hover:underline">
                                    Back to Login
                                </Link>
                            </div> */}
            </CardContent>
        </Card>
    )
}
