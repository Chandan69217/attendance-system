"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppState } from "@/lib/app-state"
import { CalendarDays, Trash2 } from "lucide-react"
import { useState } from "react"

export function SessionManagement() {
    const { sessions, setSessions, addToast } = useAppState()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newSession, setNewSession] = useState({ name: "", startDate: "", endDate: "" })

    const handleAdd = () => {
        if (!newSession.name) return
        setSessions((prev) => [...prev, { id: `SES${Date.now()}`, ...newSession, status: "upcoming" as const }])
        setNewSession({ name: "", startDate: "", endDate: "" })
        setIsAddOpen(false)
        addToast({ title: "Session Created", description: `${newSession.name} has been added.`, variant: "success" })
    }

    const handleDelete = (id: string) => {
        const s = sessions.find((s) => s.id === id)
        setSessions((prev) => prev.filter((s) => s.id !== id))
        addToast({ title: "Session Removed", description: `${s?.name} has been deleted.`, variant: "destructive" })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Academic Sessions</h3>
                    <p className="text-sm text-muted-foreground">Manage semesters, terms, and academic calendars</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild><Button className="gap-2"><CalendarDays className="h-4 w-4" />New Session</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="sr-only"></DialogTitle>
                        <DialogHeader><DialogTitle>Create Session</DialogTitle><DialogDescription>Add a new academic session.</DialogDescription></DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2"><Label>Session Name</Label><Input value={newSession.name} onChange={(e) => setNewSession({ ...newSession, name: e.target.value })} placeholder="e.g. Summer 2026" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2"><Label>Start Date</Label><Input type="date" value={newSession.startDate} onChange={(e) => setNewSession({ ...newSession, startDate: e.target.value })} /></div>
                                <div className="flex flex-col gap-2"><Label>End Date</Label><Input type="date" value={newSession.endDate} onChange={(e) => setNewSession({ ...newSession, endDate: e.target.value })} /></div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
                            <Button onClick={handleAdd} disabled={!newSession.name}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {sessions.map((session) => (
                    <Card key={session.id} className={session.status === "active" ? "border-primary/30" : ""}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{session.name}</CardTitle>
                                <div className="flex items-center gap-1">
                                    <Badge className={session.status === "active" ? "bg-primary/15 text-primary border-primary/20" : session.status === "upcoming" ? "bg-accent/15 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(session.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>Start: {session.startDate}</span></div>
                                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>End: {session.endDate}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}