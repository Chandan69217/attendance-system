"use client"

import React from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"





export function FacultyExams() {
    const { exams, setExams, addToast } = useAppState()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newExam, setNewExam] = useState({ subject: "", date: "", time: "", venue: "", type: "Mid-term" })

    const handleAdd = () => {
        if (!newExam.subject || !newExam.date) return
        setExams((prev) => [...prev, { id: `E${Date.now()}`, ...newExam }])
        setNewExam({ subject: "", date: "", time: "", venue: "", type: "Mid-term" })
        setIsAddOpen(false)
        addToast({ title: "Exam Scheduled", description: `${newExam.subject} ${newExam.type} has been scheduled.`, variant: "success" })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div><h3 className="text-lg font-semibold text-foreground">Exam Schedules</h3><p className="text-sm text-muted-foreground">Create and manage examination schedules</p></div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Schedule Exam</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="sr-only"></DialogTitle>
                        <DialogHeader><DialogTitle>Schedule Exam</DialogTitle><DialogDescription>Add a new examination.</DialogDescription></DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Subject</Label>
                                <Select value={newExam.subject} onValueChange={(v) => setNewExam({ ...newExam, subject: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                                        <SelectItem value="Algorithms">Algorithms</SelectItem>
                                        <SelectItem value="Linear Algebra">Linear Algebra</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2"><Label>Date</Label><Input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} /></div>
                                <div className="flex flex-col gap-2"><Label>Time</Label><Input value={newExam.time} onChange={(e) => setNewExam({ ...newExam, time: e.target.value })} placeholder="09:00 AM" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2"><Label>Venue</Label><Input value={newExam.venue} onChange={(e) => setNewExam({ ...newExam, venue: e.target.value })} placeholder="Hall A" /></div>
                                <div className="flex flex-col gap-2">
                                    <Label>Type</Label>
                                    <Select value={newExam.type} onValueChange={(v) => setNewExam({ ...newExam, type: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Mid-term">Mid-term</SelectItem><SelectItem value="Final">Final</SelectItem><SelectItem value="Quiz">Quiz</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
                            <Button onClick={handleAdd} disabled={!newExam.subject || !newExam.date}>Schedule</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Venue</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {exams.map((exam) => (
                                <TableRow key={exam.id}>
                                    <TableCell className="font-medium text-foreground">{exam.subject}</TableCell>
                                    <TableCell><Badge variant="secondary">{exam.type}</Badge></TableCell>
                                    <TableCell>{exam.date}</TableCell>
                                    <TableCell>{exam.time}</TableCell>
                                    <TableCell>{exam.venue}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}