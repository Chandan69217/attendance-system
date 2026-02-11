"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FacultyAttendance, User } from "@/lib/types"
import {
 LogIn, LogOut,
  Fingerprint, ShieldCheck,
} from "lucide-react"
import { useRef } from "react"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FaceAuthDialog } from "@/components/face-recognition"




export function FacultySelfAttendance() {
  const todayDate = new Date()
  const dayStr = todayDate.toLocaleDateString("en-CA").split('T')[0]
  const { user } = useAuth()
  const { facultyAttendance, setFacultyAttendance, addToast } = useAppState()
  const myRecords = facultyAttendance.filter((fa) => fa.facultyId === (user?.id ?? "F001"))
  const todayRecord = myRecords.find((r) => r.date === dayStr)
  const isCheckedIn = !!todayRecord?.checkIn
  const isCheckedOut = !!todayRecord?.checkOut
  const [remarks, setRemarks] = useState("")
  const [openFaceRecognition,setOpenFaceRecognition] = useState(false);
  const [mode,setMode] = useState<'in'|'out'>('in')


  const handleCheckIn = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    const isLate = now.getHours() >= 9 && now.getMinutes() > 15
    const dateStr = now.toLocaleDateString("en-CA").split('T')[0]
    if (todayRecord) {
      setFacultyAttendance((prev) => prev.map((r) => r.id === todayRecord.id ? { ...r, checkIn: timeStr, status: isLate ? "late" as const : "present" as const, remarks: remarks || r.remarks } : r))
    } else {
      const newRecord: FacultyAttendance = {
        id: `FA${Date.now()}`,
        facultyId: user?.id ?? "F001",
        facultyName: user?.name ?? "Faculty",
        date: dateStr,
        checkIn: timeStr,
        status: isLate ? "late" : "present",
        verificationStatus: "pending",
        remarks: remarks || undefined,
      }
      setFacultyAttendance((prev) => [newRecord, ...prev])
    }
    addToast({ title: "Checked In", description: `Check-in recorded at ${timeStr}. Pending admin verification.`, variant: "success" })
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    if (todayRecord) {
      setFacultyAttendance((prev) => prev.map((r) => r.id === todayRecord.id ? { ...r, checkOut: timeStr } : r))
    }
    addToast({ title: "Checked Out", description: `Check-out recorded at ${timeStr}.`, variant: "success" })
  }

  const currentToday = facultyAttendance.find((r) => r.facultyId === (user?.id ?? "F001") && r.date === "2026-02-06")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">My Attendance</h3>
        <p className="text-sm text-muted-foreground">Mark your daily attendance. This will be verified by the principal/admin.</p>
      </div>

      <FaceAuthDialog selectedUser={user!}open = {openFaceRecognition} onVerify ={ (v)=>{
        if(v){
          if(mode === 'in'){
            handleCheckIn()
          }else{
            handleCheckOut()
          }
        }
      }} onClose={setOpenFaceRecognition}/>
      
      <Card className="border-primary/20">
        <CardHeader><CardTitle className="text-base">Today - Feb 6, 2026</CardTitle><CardDescription>Mark your check-in and check-out</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isCheckedIn ? "bg-primary/10" : "bg-muted"}`}>
                  <LogIn className={`h-8 w-8 ${isCheckedIn ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className="text-sm font-medium text-foreground">Check In</p>
                {isCheckedIn && currentToday?.checkIn ? (
                  <p className="text-lg font-bold text-primary">{currentToday.checkIn}</p>
                ) : (
                  <Button onClick={()=>{setOpenFaceRecognition(true);setMode('in')}} className="gap-2"><Fingerprint className="h-4 w-4" />Check In Now</Button>
                )}
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isCheckedOut ? "bg-primary/10" : "bg-muted"}`}>
                  <LogOut className={`h-8 w-8 ${isCheckedOut ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className="text-sm font-medium text-foreground">Check Out</p>
                {isCheckedOut && currentToday?.checkOut ? (
                  <p className="text-lg font-bold text-primary">{currentToday.checkOut}</p>
                ) : isCheckedIn ? (
                  <Button onClick={()=>{setOpenFaceRecognition(true); setMode('out')}} variant="outline" className="gap-2 bg-transparent"><LogOut className="h-4 w-4" />Check Out Now</Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Check in first</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2"><Label>Remarks (optional)</Label><Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="E.g., traffic delay, will leave early" /></div>
            {currentToday && (
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1"><p className="text-sm font-medium text-foreground">Verification Status</p><p className="text-xs text-muted-foreground">Your attendance will be reviewed by the principal/admin</p></div>
                <Badge className={currentToday.verificationStatus === "approved" ? "bg-primary/15 text-primary border-primary/20" : currentToday.verificationStatus === "rejected" ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-chart-3/15 text-chart-3 border-chart-3/20"}>
                  {currentToday.verificationStatus.charAt(0).toUpperCase() + currentToday.verificationStatus.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Attendance History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Status</TableHead><TableHead>Verification</TableHead><TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-sm font-medium text-foreground">{record.date}</TableCell>
                  <TableCell className="text-sm">{record.checkIn || "---"}</TableCell>
                  <TableCell className="text-sm">{record.checkOut || "---"}</TableCell>
                  <TableCell>
                    <Badge className={record.status === "present" ? "bg-primary/15 text-primary border-primary/20" : record.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : record.status === "on-leave" ? "bg-accent/15 text-accent border-accent/20" : "bg-destructive/15 text-destructive"}>
                      {record.status === "on-leave" ? "On Leave" : record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={record.verificationStatus === "approved" ? "bg-primary/15 text-primary border-primary/20" : record.verificationStatus === "rejected" ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-chart-3/15 text-chart-3 border-chart-3/20"}>
                      {record.verificationStatus.charAt(0).toUpperCase() + record.verificationStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.remarks ?? "---"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}








