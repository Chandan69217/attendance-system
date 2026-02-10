"use client"

import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
   Download,
} from "lucide-react"



export function FacultyAttendanceRecords() {
  const { attendance } = useAppState()
  const [dateFilter, setDateFilter] = useState("2026-02-06")
  const filteredRecords = attendance.filter((r) => r.date === dateFilter && r.markedBy === "F001")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Class Attendance Records</h3><p className="text-sm text-muted-foreground">View student attendance for your classes</p></div>
        <div className="flex gap-2">
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
          <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Student ID</TableHead><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No records found for this date</TableCell></TableRow>
              ) : filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.studentId}</TableCell>
                  <TableCell className="font-medium text-foreground">{record.studentName}</TableCell>
                  <TableCell>{record.subject}</TableCell>
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