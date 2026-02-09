"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppState } from "@/lib/app-state"
import { Bell, CalendarDays, ClipboardList, Send, Trash2 } from "lucide-react"
import { useState } from "react"



export function AdminNotifications() {
    const { notifications, setNotifications, addToast } = useAppState()
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [category, setCategory] = useState<"announcement" | "exam" | "assignment">("announcement")
    const [target, setTarget] = useState("all")

    const handleSend = () => {
        if (!title || !message) return
        const newNotif = {
            id: `N${Date.now()}`,
            title,
            message,
            category,
            read: false,
            timestamp: new Date().toISOString(),
        }
        setNotifications((prev) => [newNotif, ...prev])
        setTitle("")
        setMessage("")
        addToast({ title: "Notification Sent", description: `"${title}" has been broadcast.`, variant: "success" })
    }

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        addToast({ title: "All Read", description: "All notifications marked as read.", variant: "default" })
    }

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Broadcast announcements and manage notifications</p>
                </div>
                {notifications.some((n) => !n.read) && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="bg-transparent">Mark All Read</Button>
                )}
            </div>

            <Card>
                <CardHeader><CardTitle className="text-base">Send New Notification</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" /></div>
                    <div className="flex flex-col gap-2"><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." rows={3} /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="announcement">Announcement</SelectItem>
                                    <SelectItem value="exam">Exam</SelectItem>
                                    <SelectItem value="assignment">Assignment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Target</Label>
                            <Select value={target} onValueChange={setTarget}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="faculty">Faculty Only</SelectItem>
                                    <SelectItem value="student">Students Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleSend} disabled={!title || !message} className="gap-2 self-start"><Send className="h-4 w-4" />Send Notification</Button>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
                {notifications.map((notif) => (
                    <Card key={notif.id} className={!notif.read ? "border-primary/20 bg-primary/[0.02]" : ""}>
                        <CardContent className="flex items-start gap-4 p-4">
                            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notif.category === "exam" ? "bg-accent/10" : notif.category === "assignment" ? "bg-chart-3/10" : "bg-primary/10"}`}>
                                {notif.category === "exam" ? <CalendarDays className="h-5 w-5 text-accent" /> : notif.category === "assignment" ? <ClipboardList className="h-5 w-5 text-chart-3" /> : <Bell className="h-5 w-5 text-primary" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm ${!notif.read ? "font-semibold" : ""} text-card-foreground`}>{notif.title}</p>
                                    {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notif.message}</p>
                                <p className="mt-1 text-xs text-muted-foreground/70">{new Date(notif.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground" onClick={() => handleDelete(notif.id)}><Trash2 className="h-4 w-4" /></Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}