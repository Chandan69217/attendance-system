"use client"

import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Users, ClipboardList, GraduationCap, TrendingUp, TrendingDown, Clock} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Legend } from "recharts"
import { getMonthlyAttendanceChartData, getWeeklyAttendanceChartData } from "@/lib/utils"



export function AdminOverview() {
  const { users, attendance, facultyAttendance } = useAppState()
  const totalStudents = users.filter((u) => u.role === "student").length
  const totalFaculty = users.filter((u) => u.role === "faculty").length
  const todayAttendance = attendance.filter((a) => a.date === "2026-02-06")
  const todayPresent = todayAttendance.filter((a) => a.status === "present").length
  const todayTotal = todayAttendance.length
  const attendanceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0
  const pendingVerifications = facultyAttendance.filter((fa) => fa.verificationStatus === "pending").length
  const today = new Date()
  const refDate = today.toISOString().split("T")[0]
  const monthlyAttendanceData = getMonthlyAttendanceChartData([...attendance,...facultyAttendance],today.getFullYear())
  const weeklyAttendanceData = getWeeklyAttendanceChartData([...attendance,...facultyAttendance],refDate) 
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Dashboard Overview</h3>
        <p className="text-sm text-muted-foreground">System-wide summary and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: totalStudents, icon: GraduationCap, bg: "bg-primary/10", text: "text-primary" },
          { label: "Total Faculty", value: totalFaculty, icon: Users, bg: "bg-accent/10", text: "text-accent" },
          { label: "Today's Rate", value: `${attendanceRate}%`, icon: ClipboardList, bg: "bg-chart-3/10", text: "text-chart-3", trend: attendanceRate >= 80 },
          { label: "Pending Verifications", value: pendingVerifications, icon: Clock, bg: "bg-destructive/10", text: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.text}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  {stat.trend !== undefined && (stat.trend ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Attendance</CardTitle>
            <CardDescription>Present vs absent students this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendanceData}>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Attendance Trend</CardTitle>
            <CardDescription>Average attendance percentage per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                  <Line type="monotone" dataKey="percentage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))" }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Attendance</CardTitle>
          <CardDescription>Last recorded attendance entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.slice(0, 6).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.studentName}</TableCell>
                  <TableCell>{r.subject}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{r.method?.replace("-", " ") ?? "manual"}</Badge></TableCell>
                  <TableCell>
                    <Badge className={r.status === "present" ? "bg-primary/15 text-primary border-primary/20" : r.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}