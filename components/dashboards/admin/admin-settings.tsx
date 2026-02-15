"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularLoader } from "@/components/ui/circular-loader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationPicker } from "@/components/ui/location-picker"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAppState } from "@/lib/app-state"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, SETTINGS_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { AppSettings } from "@/lib/types"
import { useEffect, useState } from "react"




const defaultSettings: AppSettings = {
    confidence_threshold: 85,
    late_threshold: 15,
    max_check_in_distance: 100,

    allow_student_self_attendance: true,
    require_faculty_verification: true,

    send_absent_notifications: true,
    email_notifications: true,
    low_attendance_alerts: true,
    daily_reports: false,

    min_attendance_percent: 75,

    semester_start: "",
    semester_end: "",

    holidays: [],

    latitude: 0,
    longitude: 0,
}


export function AdminSettings() {
    const { addToast } = useAppState()


    const { logout } = useAuth()

    const handleSave = async (section: string) => {
        try {
            toggle_loading(section)

            const token = localStorage.getItem(StorageKey.TOKEN)

            const res = await fetch(`${API_BASE_URL}${SETTINGS_API.SAVE}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(settings),
            })

            if (res.status === 401) {
                logout()
                throw new Error("Unauthorized")
            }

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message ?? "Failed to update settings")
            }

            addToast({
                title: "Settings Saved",
                description: `${section} settings have been updated.`,
                variant: "success",
            })

        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message ?? "Something went wrong",
                variant: "destructive",
            })
        } finally {
            toggle_loading(section)
        }
    }

    const today = new Date().toISOString().split("T")[0]

    const getOneYearLater = (dateStr: string) => {
        if (!dateStr) return ""

        const date = new Date(dateStr)
        date.setFullYear(date.getFullYear() + 1)

        return date.toISOString().split("T")[0]
    }

    const [isLoading, setIsLoading] = useState(false)
    const [isRecogSettings, setIsRocogSettings] = useState(false)
    const [isAttendSettings, setIsAttendSettings] = useState(false)
    const [isAccadSettings, setIsAccadSettings] = useState(false)
    const [isNotifSettings, setIsNotifSettings] = useState(false)

    const [settings, setSettings] = useState(defaultSettings)

    const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    const toggle_loading = (section: string) => {
        switch (section) {
            case "Recognition":
                setIsRocogSettings(prev => !prev)
                break

            case "Attendance Policies":
                setIsAttendSettings(prev => !prev)
                break

            case "Academic Calendar":
                setIsAccadSettings(prev => !prev)
                break

            case "Notification":
                setIsNotifSettings(prev => !prev)
                break

            default:
                break
        }
    }

    useEffect(() => {
        const getSettings = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem(StorageKey.TOKEN)

                const res = await fetch(`${API_BASE_URL}${SETTINGS_API.GET}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (res.status === 401) {
                    useAuth().logout()
                    throw new Error("UnAuthorized")
                }

                const data = await res.json()

                if (!res.ok) throw new Error(`status=${res.status}, message=${data.message ?? "Something went wrong"}`)
                console.log(data.data)
                setSettings(data.data)
            } catch (error: any) {
                console.log({ "error": error.message || "Something went wrong" })
            }
            setIsLoading(false)
        }
        getSettings()
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground">System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure recognition, attendance policies, and system preferences</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {isLoading ? (
                    <CircularLoader />
                ) :
                    (<>

                        <Card>
                            <CardHeader><CardTitle className="text-base">Recognition Settings</CardTitle><CardDescription>Configure face recognition parameters</CardDescription></CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2"><Label>Confidence Threshold (%)</Label><Input min={0} max={100}type="number" value={settings.confidence_threshold} onChange={(e) => updateSetting("confidence_threshold", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Minimum confidence for face matching</p></div>
                                <div className="flex flex-col gap-2"><Label>Late Threshold (minutes)</Label><Input min={0} type="number" value={settings.late_threshold} onChange={(e) => updateSetting("late_threshold", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Minutes after class start to mark as late</p></div>
                                <div className="flex flex-col gap-2"><Label>Max Self Check-In Distance (m)</Label><Input min={0} type="number" value={settings.max_check_in_distance} onChange={(e) => updateSetting("max_check_in_distance", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Geofencing radius for self-attendance</p></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Latitude</Label>
                                        <Input type={"number"} value={settings.latitude} onChange={(e) => updateSetting("latitude", Number(e.target.value))} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Longitude</Label>
                                        <Input type = {"number"} value={settings.longitude} onChange={(e) => updateSetting("longitude", Number(e.target.value))} />
                                    </div>
                                </div>

                                {/* <LocationPicker
                            onSelect={(lat, lng) => {
                                updateSetting("latitude", lat)
                                updateSetting("longitude", lng)
                            }}
                        /> */}

                                <Button disabled = {isRecogSettings} className="self-start" onClick={() => handleSave("Recognition")}>Save Changes</Button>
                            </CardContent>
                        </Card >

                        <Card>
                            <CardHeader><CardTitle className="text-base">Attendance Policies</CardTitle><CardDescription>Set institutional attendance rules</CardDescription></CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-center justify-between"><div><Label>Allow Student Self Attendance</Label><p className="text-xs text-muted-foreground">Students can mark their own attendance</p></div><Switch checked={settings.allow_student_self_attendance} onCheckedChange={(v) => updateSetting("allow_student_self_attendance", v)} /></div>
                                <div className="flex items-center justify-between"><div><Label>Require Faculty Verification</Label><p className="text-xs text-muted-foreground">Faculty attendance verified by admin</p></div><Switch checked={settings.require_faculty_verification} onCheckedChange={(v) => updateSetting("require_faculty_verification", v)} /></div>
                                <div className="flex items-center justify-between"><div><Label>Send Absent Notifications</Label><p className="text-xs text-muted-foreground">Auto-notify students marked absent</p></div><Switch checked={settings.send_absent_notifications} onCheckedChange={(v) => updateSetting("send_absent_notifications", v)} /></div>
                                <div className="flex flex-col gap-2"><Label>Minimum Attendance (%)</Label><Input min={0} max={100} type="number" value={settings.min_attendance_percent} onChange={(e) => updateSetting("min_attendance_percent", Number(e.target.value))} /></div>
                                <Button disabled = {isAttendSettings} className="self-start" onClick={() => handleSave("Attendance Policies")}>Save Policies</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-base">Academic Calendar</CardTitle><CardDescription>Manage semester dates and holidays</CardDescription></CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-row gap-4 justify-between">

                                    {/* Semester Start */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Semester Start</Label>
                                        <Input
                                            type="date"
                                            min={today}
                                            value={settings.semester_start}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                updateSetting("semester_start", value)

                                                // Reset end date if invalid
                                                if (settings.semester_end && settings.semester_end < value) {
                                                    updateSetting("semester_end", "")
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Semester End */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Semester End</Label>
                                        <Input
                                            type="date"
                                            min={settings.semester_start || today}
                                            max={getOneYearLater(settings.semester_start)}
                                            value={settings.semester_end}
                                            onChange={(e) =>
                                                updateSetting("semester_end", e.target.value)
                                            }
                                            disabled={!settings.semester_start}
                                        />
                                    </div>

                                </div>

                                <div className="flex flex-col gap-2"><Label>Holiday Dates (comma-separated)</Label><Textarea value={settings.holidays} onChange={(e) => updateSetting("holidays", e.target.value.split(/[,\s]+/))} rows={2} /></div>
                                <Button disabled = {isAccadSettings} className="self-start" onClick={() => handleSave("Academic Calendar")}>Update Calendar</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-base">Notification Settings</CardTitle><CardDescription>Configure system notifications</CardDescription></CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-center justify-between"><div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Send email for important events</p></div><Switch checked={settings.email_notifications} onCheckedChange={(v) => updateSetting("email_notifications", v)} /></div>
                                <div className="flex items-center justify-between"><div><Label>Low Attendance Alerts</Label><p className="text-xs text-muted-foreground">Alert when student below threshold</p></div><Switch checked={settings.low_attendance_alerts} onCheckedChange={(v) => updateSetting("low_attendance_alerts", v)} /></div>
                                <div className="flex items-center justify-between"><div><Label>Daily Reports</Label><p className="text-xs text-muted-foreground">Auto-generate daily summaries</p></div><Switch checked={settings.daily_reports} onCheckedChange={(v) => updateSetting("daily_reports", v)} /></div>
                                <Button disabled={isNotifSettings} className="self-start" onClick={() => handleSave("Notification")}>Save Notifications</Button>
                            </CardContent>
                        </Card>
                    </>
                    )}
            </div>
        </div>
    )
}