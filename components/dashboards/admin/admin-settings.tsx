"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocationPicker } from "@/components/ui/location-picker"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAppState } from "@/lib/app-state"


export function AdminSettings() {
    const { settings, setSettings, addToast } = useAppState()

    const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    const handleSave = (section: string) => {
        addToast({ title: "Settings Saved", description: `${section} settings have been updated.`, variant: "success" })
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground">System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure recognition, attendance policies, and system preferences</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle className="text-base">Recognition Settings</CardTitle><CardDescription>Configure face recognition parameters</CardDescription></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2"><Label>Confidence Threshold (%)</Label><Input type="number" value={settings.confidenceThreshold} onChange={(e) => updateSetting("confidenceThreshold", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Minimum confidence for face matching</p></div>
                        <div className="flex flex-col gap-2"><Label>Late Threshold (minutes)</Label><Input type="number" value={settings.lateThreshold} onChange={(e) => updateSetting("lateThreshold", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Minutes after class start to mark as late</p></div>
                        <div className="flex flex-col gap-2"><Label>Max Self Check-In Distance (m)</Label><Input type="number" value={settings.maxCheckInDistance} onChange={(e) => updateSetting("maxCheckInDistance", Number(e.target.value))} /><p className="text-xs text-muted-foreground">Geofencing radius for self-attendance</p></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Latitude</Label>
                                <Input value={settings.latitude} readOnly />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Longitude</Label>
                                <Input value={settings.longitude} readOnly />
                            </div>
                        </div>

                        {/* <LocationPicker
                            onSelect={(lat, lng) => {
                                updateSetting("latitude", lat)
                                updateSetting("longitude", lng)
                            }}
                        /> */}

                        <Button className="self-start" onClick={() => handleSave("Recognition")}>Save Changes</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Attendance Policies</CardTitle><CardDescription>Set institutional attendance rules</CardDescription></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center justify-between"><div><Label>Allow Student Self Attendance</Label><p className="text-xs text-muted-foreground">Students can mark their own attendance</p></div><Switch checked={settings.allowStudentSelfAttendance} onCheckedChange={(v) => updateSetting("allowStudentSelfAttendance", v)} /></div>
                        <div className="flex items-center justify-between"><div><Label>Require Faculty Verification</Label><p className="text-xs text-muted-foreground">Faculty attendance verified by admin</p></div><Switch checked={settings.requireFacultyVerification} onCheckedChange={(v) => updateSetting("requireFacultyVerification", v)} /></div>
                        <div className="flex items-center justify-between"><div><Label>Send Absent Notifications</Label><p className="text-xs text-muted-foreground">Auto-notify students marked absent</p></div><Switch checked={settings.sendAbsentNotifications} onCheckedChange={(v) => updateSetting("sendAbsentNotifications", v)} /></div>
                        <div className="flex flex-col gap-2"><Label>Minimum Attendance (%)</Label><Input type="number" value={settings.minAttendancePercent} onChange={(e) => updateSetting("minAttendancePercent", Number(e.target.value))} /></div>
                        <Button className="self-start" onClick={() => handleSave("Attendance Policies")}>Save Policies</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Academic Calendar</CardTitle><CardDescription>Manage semester dates and holidays</CardDescription></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2"><Label>Semester Start</Label><Input type="date" value={settings.semesterStart} onChange={(e) => updateSetting("semesterStart", e.target.value)} /></div>
                        <div className="flex flex-col gap-2"><Label>Semester End</Label><Input type="date" value={settings.semesterEnd} onChange={(e) => updateSetting("semesterEnd", e.target.value)} /></div>
                        <div className="flex flex-col gap-2"><Label>Holiday Dates (comma-separated)</Label><Textarea value={settings.holidays} onChange={(e) => updateSetting("holidays", e.target.value)} rows={2} /></div>
                        <Button className="self-start" onClick={() => handleSave("Academic Calendar")}>Update Calendar</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Notification Settings</CardTitle><CardDescription>Configure system notifications</CardDescription></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center justify-between"><div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Send email for important events</p></div><Switch checked={settings.emailNotifications} onCheckedChange={(v) => updateSetting("emailNotifications", v)} /></div>
                        <div className="flex items-center justify-between"><div><Label>Low Attendance Alerts</Label><p className="text-xs text-muted-foreground">Alert when student below threshold</p></div><Switch checked={settings.lowAttendanceAlerts} onCheckedChange={(v) => updateSetting("lowAttendanceAlerts", v)} /></div>
                        <div className="flex items-center justify-between"><div><Label>Daily Reports</Label><p className="text-xs text-muted-foreground">Auto-generate daily summaries</p></div><Switch checked={settings.dailyReports} onCheckedChange={(v) => updateSetting("dailyReports", v)} /></div>
                        <Button className="self-start" onClick={() => handleSave("Notification")}>Save Notifications</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}