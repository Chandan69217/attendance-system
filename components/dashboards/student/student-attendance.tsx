"use client"

import React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { subjectAttendanceData } from "@/lib/mock-data"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"



export function StudentAttendance() {
    const { user } = useAuth()
    const { attendance } = useAppState()
    const myAttendance = attendance.filter((a) => a.studentId === (user?.id ?? "S001"))

    return (
        <div className="flex flex-col gap-6">
            <div><h3 className="text-lg font-semibold text-foreground">My Attendance</h3><p className="text-sm text-muted-foreground">Your complete attendance history</p></div>
            <Card>
                <CardHeader><CardTitle className="text-base">Attendance by Subject</CardTitle></CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectAttendanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                <YAxis type="category" dataKey="subject" width={120} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                                <Bar dataKey="percentage" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Attendance %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="text-base">Attendance Records</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Subject</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {myAttendance.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No attendance records yet</TableCell></TableRow>
                            ) : myAttendance.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell className="font-medium text-foreground">{record.subject}</TableCell>
                                    <TableCell><Badge variant="secondary" className="text-xs capitalize">{record.method?.replace("-", " ") ?? "manual"}</Badge></TableCell>
                                    <TableCell>
                                        <Badge className={record.status === "present" ? "bg-primary/15 text-primary border-primary/20" : record.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
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