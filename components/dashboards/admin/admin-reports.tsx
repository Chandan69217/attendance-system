"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppState } from "@/lib/app-state"
import { getMonthlyAttendanceChartData, getSubjectAttendanceChartData, getWeeklyAttendanceChartData } from "@/lib/utils"
import {  Download, TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Legend } from "recharts"

export function AdminReports() {
  const {attendance, facultyAttendance } = useAppState()

  const today = new Date()
  const refDate = today.toISOString().split("T")[0]
  const monthlyAttendanceData = getMonthlyAttendanceChartData([...attendance, ...facultyAttendance], today.getFullYear())
  const weeklyAttendanceData = getWeeklyAttendanceChartData([...attendance, ...facultyAttendance], refDate) 
  const subjectByAttendance = getSubjectAttendanceChartData(attendance)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Generate and export attendance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export PDF</Button>
          <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export CSV</Button>
        </div>
      </div>
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="subject">By Subject</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Daily Attendance Report</CardTitle><CardDescription>Attendance breakdown for the week</CardDescription></CardHeader>
            <CardContent>
              <div className="h-72">
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
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Trend</CardTitle><CardDescription>Attendance trend over the semester</CardDescription></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis domain={[70, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                    <Line type="monotone" dataKey="percentage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subject" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Subject-wise Attendance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {subjectByAttendance.map((item) => (
                  <div key={item.subject} className="flex items-center gap-4">
                    <span className="w-36 text-sm font-medium text-foreground">{item.subject}</span>
                    <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} /></div></div>
                    <span className="w-12 text-right text-sm font-semibold text-foreground">{item.percentage}%</span>
                    {item.percentage >= 90 ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-chart-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faculty" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Faculty Attendance Summary</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Leave/Absent</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["F001", "F002", "F003", "F004"].map((fid) => {
                    const records = facultyAttendance.filter((r) => r.facultyId === fid)
                    const name = records[0]?.facultyName ?? fid
                    return (
                      <TableRow key={fid}>
                        <TableCell className="font-medium text-foreground">{name}</TableCell>
                        <TableCell>{records.length}</TableCell>
                        <TableCell className="font-medium text-primary">{records.filter((r) => r.status === "present" || r.status === "late").length}</TableCell>
                        <TableCell className="font-medium text-destructive">{records.filter((r) => r.status === "absent" || r.status === "on-leave").length}</TableCell>
                        <TableCell><Badge className="bg-primary/15 text-primary border-primary/20">{records.filter((r) => r.verificationStatus === "approved").length}</Badge></TableCell>
                        <TableCell><Badge className="bg-chart-3/15 text-chart-3 border-chart-3/20">{records.filter((r) => r.verificationStatus === "pending").length}</Badge></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
