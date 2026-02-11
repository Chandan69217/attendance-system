"use client"


import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"






export function StudentAssignments() {
    const { assignments, setAssignments, addToast } = useAppState()

    const handleSubmit = (id: string) => {
        setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, status: "submitted" as const } : a))
        const a = assignments.find((a) => a.id === id)
        addToast({ title: "Assignment Submitted", description: `"${a?.title}" has been submitted successfully.`, variant: "success" })
    }

    const [subjectFilter, setSubjectFilter] = useState("all")
    const subjects = Array.from(
        new Set(assignments.map((a) => a.subject))
    )

    const filteredAssignments =
        subjectFilter === "all"
            ? assignments
            : assignments.filter(
                (a) => a.subject === subjectFilter
            )


    return (
        <div className="flex flex-col gap-6">
            <div><h3 className="text-lg font-semibold text-foreground">Assignments</h3><p className="text-sm text-muted-foreground">View assignments and submission deadlines</p></div>
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm font-medium">Filter by Subject:</span>

                    <Select
                        value={subjectFilter}
                        onValueChange={setSubjectFilter}
                    >
                        <SelectTrigger className="w-full sm:w-60">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                    {subject}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredAssignments.map((assignment) => {
                    const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date("2026-02-06").getTime()) / (1000 * 60 * 60 * 24))
                    return (
                        <Card key={assignment.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{assignment.title}</CardTitle>
                                    <Badge variant="secondary" className={assignment.status === "pending" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-primary/15 text-primary border-primary/20"}>
                                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                    </Badge>
                                </div>
                                <CardDescription>{assignment.subject}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{assignment.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" /><span>Due: {assignment.dueDate}</span>
                                        {daysLeft > 0 && daysLeft <= 7 && <Badge variant="destructive" className="text-[10px]">{daysLeft}d left</Badge>}
                                    </div>
                                    {assignment.status === "pending" && (
                                        <Button size="sm" onClick={() => handleSubmit(assignment.id)} className="gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" />Submit
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}