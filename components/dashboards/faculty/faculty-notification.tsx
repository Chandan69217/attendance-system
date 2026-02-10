"use client"

import React from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"





export function FacultyNotifications() {
    const { notifications, setNotifications, addToast } = useAppState()
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [category, setCategory] = useState<"announcement" | "exam" | "assignment">("announcement")

    const handleSend = () => {
        if (!title || !message) return
        setNotifications((prev) => [{ id: `N${Date.now()}`, title, message, category, read: false, timestamp: new Date().toISOString() }, ...prev])
        addToast({ title: "Notification Sent", description: `"${title}" broadcast to students.`, variant: "success" })
        setTitle("")
        setMessage("")
    }

    return (
        <div className="flex flex-col gap-6">
            <div><h3 className="text-lg font-semibold text-foreground">Send Notification</h3><p className="text-sm text-muted-foreground">Broadcast announcements to students</p></div>
            <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" /></div>
                    <div className="flex flex-col gap-2"><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your notification message..." rows={4} /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="announcement">Announcement</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="assignment">Assignment</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Target Class</Label>
                            <Select defaultValue="all">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All Classes</SelectItem><SelectItem value="cs301">CS-301</SelectItem><SelectItem value="cs302">CS-302</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleSend} disabled={!title || !message} className="gap-2 self-start"><Send className="h-4 w-4" />Send Notification</Button>
                </CardContent>
            </Card>
        </div>
    )
}