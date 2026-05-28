"use client"

import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2, XCircle, Clock,
  Fingerprint,
  FileText, 
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { useEffect, useState } from "react"
import { getFacultyAttendance, getStudentAttendance } from "@/service/attendance.service"
import { getLecture } from "@/service/lecture.service"
import { AttendanceRecord, FacultyAttendance, Lecture } from "@/lib/types"

export function FacultyOverview() {
    const { user } = useAuth()
    const { assignments } = useAppState()
    const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([])
    const [myToday, setMyToday] = useState<FacultyAttendance | undefined>(undefined)
    const [pendingVerification, setPendingVerification] = useState(0)
    const [weeklyData, setWeeklyData] = useState<any[]>([])
    
    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            const date = new Date().toISOString().split("T")[0]
            
            // Fetch students' attendance marked by this faculty
            try {
                const stdAttendance = await getStudentAttendance(undefined, date)
                if (stdAttendance) {
                    setTodayRecords(stdAttendance.filter(a => a.marked_by === user.id))
                }
            } catch (e) {}

            // Fetch my attendance
            try {
                const facAtt = await getFacultyAttendance(user.id, date)
                if (facAtt && facAtt.length > 0) {
                    setMyToday(facAtt[0])
                }
                const allFacAtt = await getFacultyAttendance(user.id)
                if (allFacAtt) {
                    setPendingVerification(allFacAtt.filter(fa => fa.verification_status === "pending").length)
                }
            } catch (e) {}
        }
        
        fetchData()
    }, [user])

    const presentCount = todayRecords.filter((a) => a.status === "present").length
    const absentCount = todayRecords.filter((a) => a.status === "absent").length
    const pendingAssignments = assignments.filter((a) => a.status === "pending" && a.createdBy === user?.id).length

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground">Welcome back, {user?.name?.split(" ").pop()}</h3>
                <p className="text-sm text-muted-foreground">Here is your daily summary and quick actions.</p>
            </div>

            <Card className={myToday?.verification_status === "approved" ? "border-primary/30" : myToday?.verification_status === "pending" ? "border-chart-3/30" : ""}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${myToday ? "bg-primary/10" : "bg-muted"}`}>
                            <Fingerprint className={`h-5 w-5 ${myToday ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Your Attendance Today</p>
                            {myToday ? (
                                <p className="text-xs text-muted-foreground">
                                    Checked in at {myToday.check_in} {myToday.check_out ? `| Out: ${myToday.check_out}` : "| Not checked out"} | Status: {myToday.verification_status}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">Not checked in yet</p>
                            )}
                        </div>
                    </div>
                    {myToday?.verification_status === "approved" && <Badge className="bg-primary/15 text-primary border-primary/20">Verified</Badge>}
                    {myToday?.verification_status === "pending" && <Badge className="bg-chart-3/15 text-chart-3 border-chart-3/20">Pending Verification</Badge>}
                    {!myToday && <Badge variant="destructive">Not Marked</Badge>}
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Students Present", value: presentCount, icon: CheckCircle2, bg: "bg-primary/10", text: "text-primary" },
                    { label: "Students Absent", value: absentCount, icon: XCircle, bg: "bg-destructive/10", text: "text-destructive" },
                    { label: "Pending Assignments", value: pendingAssignments, icon: FileText, bg: "bg-chart-3/10", text: "text-chart-3" },
                    { label: "My Pending Verif.", value: pendingVerification, icon: Clock, bg: "bg-accent/10", text: "text-accent" },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                                <s.icon className={`h-6 w-6 ${s.text}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader><CardTitle className="text-base">Weekly Class Attendance</CardTitle><CardDescription>Present vs absent for your classes</CardDescription></CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                                <Legend />
                                <Bar dataKey="present" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Present" />
                                <Bar dataKey="absent" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Absent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}