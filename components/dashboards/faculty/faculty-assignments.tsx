"use client"

import React from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Calendar, Plus,
} from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export function FacultyAssignments() {
    const { assignments, setAssignments, addToast } = useAppState()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newAssign, setNewAssign] = useState({ title: "", subject: "", dueDate: "", description: "" })
    const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false)
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState<any>()

    const submissions: Submission[] = [
        {
            id: "S1",
            studentName: "Rahul Sharma",
            submittedAt: "Feb 5, 2026",
            status: "pending",
        },
    ]

    const handleAdd = () => {
        if (!newAssign.title || !newAssign.subject) return
        setAssignments((prev) => [...prev, { id: `AS${Date.now()}`, ...newAssign, status: "pending" as const, createdBy: "F001" }])
        setNewAssign({ title: "", subject: "", dueDate: "", description: "" })
        setIsAddOpen(false)
        addToast({ title: "Assignment Created", description: `"${newAssign.title}" has been posted.`, variant: "success" })
    }

    const handleDelete = (id: string) => {
        const a = assignments.find((a) => a.id === id)
        setAssignments((prev) => prev.filter((a) => a.id !== id))
        addToast({ title: "Assignment Deleted", description: `"${a?.title}" has been removed.`, variant: "destructive" })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div><h3 className="text-lg font-semibold text-foreground">Assignments</h3><p className="text-sm text-muted-foreground">Create and manage assignments</p></div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New Assignment</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="sr-only"></DialogTitle>
                        <DialogHeader><DialogTitle>Create Assignment</DialogTitle><DialogDescription>Add a new assignment for students.</DialogDescription></DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2"><Label>Title</Label><Input value={newAssign.title} onChange={(e) => setNewAssign({ ...newAssign, title: e.target.value })} placeholder="Assignment title" /></div>
                            <div className="flex flex-col gap-2">
                                <Label>Target Class</Label>
                                <Select defaultValue="all">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">All Classes</SelectItem><SelectItem value="cs301">CS-301</SelectItem><SelectItem value="cs302">CS-302</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Subject</Label>
                                    <Select value={newAssign.subject} onValueChange={(v) => setNewAssign({ ...newAssign, subject: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Data Structures">Data Structures</SelectItem>
                                            <SelectItem value="Algorithms">Algorithms</SelectItem>
                                            <SelectItem value="Linear Algebra">Linear Algebra</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2"><Label>Due Date</Label><Input type="date" value={newAssign.dueDate} onChange={(e) => setNewAssign({ ...newAssign, dueDate: e.target.value })} /></div>
                            </div>
                            <div className="flex flex-col gap-2"><Label>Description</Label><Textarea value={newAssign.description} onChange={(e) => setNewAssign({ ...newAssign, description: e.target.value })} placeholder="Assignment details..." rows={3} /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
                            <Button onClick={handleAdd} disabled={!newAssign.title || !newAssign.subject}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Input type="date" value={""} onChange={(e) => ()=>{}} className="w-auto" />
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="cs301">CS-301</SelectItem>
                                <SelectItem value="cs302">CS-302</SelectItem>
                            </SelectContent>
                        </Select>


                    </div>
                </CardContent>
            </Card>
         

            <div className="grid gap-4 md:grid-cols-2">
                {assignments.map((assignment) => (
                    <Card key={assignment.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{assignment.title}</CardTitle>
                                <Badge variant="secondary" className={assignment.status === "pending" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : assignment.status === "submitted" ? "bg-primary/15 text-primary border-primary/20" : "bg-accent/15 text-accent border-accent/20"}>
                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </Badge>
                            </div>
                            <CardDescription>{assignment.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{assignment.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /><span>Due: {assignment.dueDate}</span></div>
                                <div className="flex flex-row gap-4">
                                    <Button size="sm" variant="ghost" className="h-8 " onClick={() => setSubmissionDialogOpen(true)}>View Submission</Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => handleDelete(assignment.id)}>Delete</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <SubmissionListDialog
                open={submissionDialogOpen}
                onClose={() => setSubmissionDialogOpen(false)}
                submissions={submissions}
                onReview={(s) => {
                    setSelectedSubmission(s)
                    setSubmissionDialogOpen(false)
                    setReviewDialogOpen(true)
                }}
            />

            <ReviewSubmissionDialog
                open={reviewDialogOpen}
                submission={selectedSubmission}
                onClose={() => {
                    setReviewDialogOpen(false)
                    setSubmissionDialogOpen(true)
                }
                }
                onApprove={(id, remarks) => {
                    console.log("Approved", id, remarks)
                    setReviewDialogOpen(false)
                    setSubmissionDialogOpen(true)
                }}
                onReject={(id, remarks) => {
                    console.log("Rejected", id, remarks)
                    setReviewDialogOpen(false)
                    setSubmissionDialogOpen(true)
                }}
            />

        </div>
    )
}







type Submission = {
    id: string
    studentName: string
    submittedAt: string
    status: "pending" | "approved" | "rejected"
}

interface SubmissionListDialogProps {
    open: boolean
    onClose: () => void
    submissions: Submission[]
    onReview: (submission: Submission) => void
}

export function SubmissionListDialog({
    open,
    onClose,
    submissions,
    onReview,
}: SubmissionListDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Student Submissions</DialogTitle>
                    <DialogDescription>
                        Review and verify student submissions
                    </DialogDescription>
                </DialogHeader>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Submitted On</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {submissions.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">
                                    {s.studentName}
                                </TableCell>
                                <TableCell>{s.submittedAt}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            s.status === "approved"
                                                ? "bg-primary/15 text-primary"
                                                : s.status === "rejected"
                                                    ? "bg-destructive/15 text-destructive"
                                                    : "bg-chart-3/15 text-chart-3"
                                        }
                                    >
                                        {s.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onReview(s)}
                                        disabled={s.status !== "pending"}
                                    >
                                        Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}






interface ReviewDialogProps {
    open: boolean
    submission?: {
        id: string
        studentName: string
        submittedAt: string
    }
    onClose: () => void
    onApprove: (id: string, remarks?: string) => void
    onReject: (id: string, remarks?: string) => void
}

export function ReviewSubmissionDialog({
    open,
    submission,
    onClose,
    onApprove,
    onReject,
}: ReviewDialogProps) {
    const [remarks, setRemarks] = useState("")

    if (!submission) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Submission</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 text-sm">
                    <p><b>Student:</b> {submission.studentName}</p>
                    <p><b>Submitted:</b> {submission.submittedAt}</p>

                    <div className="flex flex-col gap-2">
                        <Label>Remarks (optional)</Label>
                        <Textarea
                            rows={3}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Feedback for student"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => onReject(submission.id, remarks)}
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={() => onApprove(submission.id, remarks)}
                    >
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
