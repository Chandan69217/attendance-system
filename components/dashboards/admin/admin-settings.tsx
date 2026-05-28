"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularLoader } from "@/components/ui/circular-loader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import TimePicker from "@/components/ui/time-picker"
import { useAppState } from "@/lib/app-state"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, SETTINGS_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { AppSettings } from "@/lib/types"
import { useEffect, useState } from "react"
import { Loader2, Save, RotateCcw, Shield, CalendarDays, Bell, BookOpen, MapPin } from "lucide-react"


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
    check_in: "10:00 AM",
}


export function AdminSettings() {
    const { addToast } = useAppState()
    // FIX: destructure logout at the top level — never call useAuth() inside a callback
    const { logout } = useAuth()

    // Track original (server) settings for reset/cancel
    const [serverSettings, setServerSettings] = useState<AppSettings>(defaultSettings)
    const [settings, setSettings] = useState<AppSettings>(defaultSettings)
    const [isLoading, setIsLoading] = useState(false)

    // Per-section save loading states
    const [loadingSection, setLoadingSection] = useState<string | null>(null)

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(serverSettings)

    // Reset all unsaved changes back to the last server-saved state
    const handleReset = () => {
        setSettings(serverSettings)
        addToast({
            title: "Changes Discarded",
            description: "Settings reverted to last saved values.",
            variant: "default",
        })
    }

    // ─── Fetch Settings ────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem(StorageKey.TOKEN)

                const res = await fetch(`${API_BASE_URL}${SETTINGS_API.GET}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (res.status === 401) {
                    // FIX: use the logout already destructured at component top level
                    logout()
                    return
                }

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.message ?? "Failed to load settings")
                }

                // FIX: ensure holidays is always an array (backend might return null/undefined)
                const loaded: AppSettings = {
                    ...defaultSettings,
                    ...data.data,
                    holidays: Array.isArray(data.data?.holidays) ? data.data.holidays : [],
                }
                setSettings(loaded)
                setServerSettings(loaded)
            } catch (error: any) {
                addToast({
                    title: "Could not load settings",
                    description: error.message ?? "Something went wrong",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Save Handler ──────────────────────────────────────────────────────────
    const handleSave = async (section: string) => {
        try {
            setLoadingSection(section)
            const token = localStorage.getItem(StorageKey.TOKEN)

            // FIX: Serialize holidays array correctly (not as object)
            const payload = {
                ...settings,
                holidays: Array.isArray(settings.holidays) ? settings.holidays : [],
            }

            const res = await fetch(`${API_BASE_URL}${SETTINGS_API.SAVE}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (res.status === 401) {
                logout()
                throw new Error("Unauthorized — please log in again.")
            }

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message ?? "Failed to save settings")
            }

            // Update server snapshot so reset works correctly after save
            setServerSettings({ ...settings })

            addToast({
                title: "Settings Saved",
                description: `${section} settings updated successfully.`,
                variant: "success",
            })
        } catch (error: any) {
            addToast({
                title: "Save Failed",
                description: error.message ?? "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setLoadingSection(null)
        }
    }

    // ─── Date helpers ──────────────────────────────────────────────────────────
    const getOneYearLater = (dateStr: string) => {
        if (!dateStr) return ""
        const d = new Date(dateStr)
        d.setFullYear(d.getFullYear() + 1)
        return d.toISOString().split("T")[0]
    }

    // FIX: do NOT set min={today} on semester dates — that prevents loading already-saved
    // past/present dates. We only enforce start < end via manual comparison.
    const today = new Date().toISOString().split("T")[0]

    // ─── Holidays helpers ──────────────────────────────────────────────────────
    // FIX: always convert array → string for display; convert string → array on change
    const holidaysDisplay = Array.isArray(settings.holidays)
        ? settings.holidays.filter(Boolean).join(", ")
        : ""

    const handleHolidaysChange = (raw: string) => {
        const arr = raw
            .split(/[,\n]+/)
            .map((s) => s.trim())
            .filter(Boolean)
        updateSetting("holidays", arr)
    }

    // ─── Save button helper ────────────────────────────────────────────────────
    const SaveBtn = ({ section, label = "Save Changes" }: { section: string; label?: string }) => (
        <Button
            className="self-start gap-2"
            disabled={loadingSection === section}
            onClick={() => handleSave(section)}
        >
            {loadingSection === section ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Save className="h-4 w-4" />
            )}
            {loadingSection === section ? "Saving…" : label}
        </Button>
    )

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6">

            {/* Header row */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">System Settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure recognition, attendance policies, notifications and academic calendar
                    </p>
                </div>

                {/* Global reset button — only shown when there are unsaved changes */}
                {hasChanges && (
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                        Discard Changes
                    </Button>
                )}
            </div>

            {/* Body */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <CircularLoader />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">

                    {/* ── 1. Recognition & Geofencing ───────────────────────── */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Recognition Settings</CardTitle>
                            </div>
                            <CardDescription>Face recognition and geofencing parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="confidence_threshold">Confidence Threshold (%)</Label>
                                <Input
                                    id="confidence_threshold"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={settings.confidence_threshold}
                                    onChange={(e) => updateSetting("confidence_threshold", Number(e.target.value))}
                                />
                                <p className="text-xs text-muted-foreground">Minimum confidence score for a face match</p>
                            </div>

                            <div className="flex flex-row gap-4">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <TimePicker
                                        label="Check-In Time"
                                        value={settings.check_in ?? "10:00 AM"}
                                        onChange={(v) => updateSetting("check_in", v)}
                                        name="check_in"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <Label htmlFor="late_threshold">Late Threshold (min)</Label>
                                    <Input
                                        id="late_threshold"
                                        type="number"
                                        min={0}
                                        value={settings.late_threshold}
                                        onChange={(e) => updateSetting("late_threshold", Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground -mt-2">
                                Minutes after check-in time before attendance is marked "late"
                            </p>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="max_check_in_distance">Max Self Check-In Distance (m)</Label>
                                <Input
                                    id="max_check_in_distance"
                                    type="number"
                                    min={0}
                                    value={settings.max_check_in_distance}
                                    onChange={(e) => updateSetting("max_check_in_distance", Number(e.target.value))}
                                />
                                <p className="text-xs text-muted-foreground">Geofencing radius for self-attendance</p>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>Campus Coordinates</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        value={settings.latitude}
                                        onChange={(e) => updateSetting("latitude", parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        value={settings.longitude}
                                        onChange={(e) => updateSetting("longitude", parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <SaveBtn section="Recognition" label="Save Recognition Settings" />
                        </CardContent>
                    </Card>

                    {/* ── 2. Attendance Policies ────────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Attendance Policies</CardTitle>
                            </div>
                            <CardDescription>Set institutional attendance rules</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Allow Student Self-Attendance</Label>
                                    <p className="text-xs text-muted-foreground">Students can mark their own attendance</p>
                                </div>
                                <Switch
                                    id="allow_student_self_attendance"
                                    checked={settings.allow_student_self_attendance}
                                    onCheckedChange={(v) => updateSetting("allow_student_self_attendance", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Require Faculty Verification</Label>
                                    <p className="text-xs text-muted-foreground">Faculty attendance must be verified by admin</p>
                                </div>
                                <Switch
                                    id="require_faculty_verification"
                                    checked={settings.require_faculty_verification}
                                    onCheckedChange={(v) => updateSetting("require_faculty_verification", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Send Absent Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Auto-notify students when marked absent</p>
                                </div>
                                <Switch
                                    id="send_absent_notifications"
                                    checked={settings.send_absent_notifications}
                                    onCheckedChange={(v) => updateSetting("send_absent_notifications", v)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="min_attendance_percent">Minimum Attendance Required (%)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="min_attendance_percent"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={settings.min_attendance_percent}
                                        onChange={(e) => updateSetting("min_attendance_percent", Number(e.target.value))}
                                    />
                                    <span className="text-sm font-semibold text-primary w-12">
                                        {settings.min_attendance_percent}%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">Students below this are flagged for low attendance</p>
                            </div>

                            <SaveBtn section="Attendance Policies" label="Save Policies" />
                        </CardContent>
                    </Card>

                    {/* ── 3. Academic Calendar ──────────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Academic Calendar</CardTitle>
                            </div>
                            <CardDescription>Manage semester dates and public holidays</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">

                            <div className="grid grid-cols-2 gap-3">
                                {/* FIX: removed min={today} so existing saved dates still display */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="semester_start">Semester Start</Label>
                                    <Input
                                        id="semester_start"
                                        type="date"
                                        value={settings.semester_start}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            updateSetting("semester_start", val)
                                            // Clear end date if it is now before the new start
                                            if (settings.semester_end && settings.semester_end < val) {
                                                updateSetting("semester_end", "")
                                            }
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="semester_end">Semester End</Label>
                                    <Input
                                        id="semester_end"
                                        type="date"
                                        min={settings.semester_start || today}
                                        max={getOneYearLater(settings.semester_start)}
                                        value={settings.semester_end}
                                        onChange={(e) => updateSetting("semester_end", e.target.value)}
                                        disabled={!settings.semester_start}
                                    />
                                </div>
                            </div>

                            {settings.semester_start && settings.semester_end && (
                                <p className="text-xs text-muted-foreground">
                                    Semester duration:{" "}
                                    <span className="font-medium text-foreground">
                                        {Math.round(
                                            (new Date(settings.semester_end).getTime() -
                                                new Date(settings.semester_start).getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )}{" "}
                                        days
                                    </span>
                                </p>
                            )}

                            {/* FIX: join array to string for display, split on change */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="holidays">Holiday Dates</Label>
                                <Textarea
                                    id="holidays"
                                    placeholder="e.g. 2026-08-15, 2026-10-02, 2026-11-04"
                                    value={holidaysDisplay}
                                    onChange={(e) => handleHolidaysChange(e.target.value)}
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Comma-separated dates (YYYY-MM-DD). Currently{" "}
                                    <span className="font-medium text-foreground">
                                        {settings.holidays.filter(Boolean).length}
                                    </span>{" "}
                                    holiday(s) set.
                                </p>
                            </div>

                            {/* Live preview of entered holidays */}
                            {settings.holidays.filter(Boolean).length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {settings.holidays.filter(Boolean).map((h, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
                                        >
                                            {h}
                                            <button
                                                type="button"
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() =>
                                                    updateSetting(
                                                        "holidays",
                                                        settings.holidays.filter((_, idx) => idx !== i)
                                                    )
                                                }
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <SaveBtn section="Academic Calendar" label="Update Calendar" />
                        </CardContent>
                    </Card>

                    {/* ── 4. Notification Settings ──────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Notification Settings</CardTitle>
                            </div>
                            <CardDescription>Configure automated system notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Email Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Send email alerts for important events</p>
                                </div>
                                <Switch
                                    id="email_notifications"
                                    checked={settings.email_notifications}
                                    onCheckedChange={(v) => updateSetting("email_notifications", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Low Attendance Alerts</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Alert students/faculty when below {settings.min_attendance_percent}% threshold
                                    </p>
                                </div>
                                <Switch
                                    id="low_attendance_alerts"
                                    checked={settings.low_attendance_alerts}
                                    onCheckedChange={(v) => updateSetting("low_attendance_alerts", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Daily Reports</Label>
                                    <p className="text-xs text-muted-foreground">Auto-generate and send daily attendance summaries</p>
                                </div>
                                <Switch
                                    id="daily_reports"
                                    checked={settings.daily_reports}
                                    onCheckedChange={(v) => updateSetting("daily_reports", v)}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <Label>Absent Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Notify students immediately when marked absent</p>
                                </div>
                                <Switch
                                    id="send_absent_notifications_2"
                                    checked={settings.send_absent_notifications}
                                    onCheckedChange={(v) => updateSetting("send_absent_notifications", v)}
                                />
                            </div>

                            <SaveBtn section="Notification" label="Save Notification Settings" />
                        </CardContent>
                    </Card>

                </div>
            )}
        </div>
    )
}