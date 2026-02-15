"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularLoader } from "@/components/ui/circular-loader"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppState } from "@/lib/app-state"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, SESSION_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { AcademicSession } from "@/lib/types"
import { getSessions } from "@/service/session.service"
import { CalendarDays, GraduationCap, Loader2, SquarePen, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export function SessionManagement() {
    const { addToast } = useAppState()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newSession, setNewSession] = useState({ name: "", start_date: "", end_date: "" })
    const [editingSession, setEditiongSession] = useState({ name: "", start_date: "", end_date: "",status:"",id:"" })
    const [isLoading, setIsLoading] = useState(false)
    const [sessions, setSessions] = useState<AcademicSession[]>([])
    const [mode , setMode] = useState("add")
    const [btnLoading , setBtnLoading] = useState(false)

    const today = new Date().toISOString().split("T")[0]
    const handleAdd = async() => {
        // if ((!newSession.name || !editingSession.name) && (!newSession.start_date || !editingSession.start_date)) return
        try{
            setBtnLoading(true)
            const token = localStorage.getItem(StorageKey.TOKEN)
            if(mode==="add"){
                const res = await fetch(`${API_BASE_URL}${SESSION_API.CREATE}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newSession)
                })

                if (res.status === 401) {
                    useAuth().logout()
                    throw new Error("UnAuthorized")
                }
                const data = await res.json()

                if (!res.ok) throw new Error(data.message || "Something went wrong")

                const status = data.status

                if (status) {
                    setNewSession({ name: "", start_date: "", end_date: ""})
                    setIsAddOpen(false)
                    await getSessionData()
                    addToast({ title: "Session Created", description: `${newSession.name} has been added.`, variant: "success" })
                } else {
                    const message = data.message
                    console.log(message)
                    addToast({ title: "Error", description: message, variant: "destructive" })
                }
            }else if(mode === "edit"){
                const res = await fetch(`${API_BASE_URL}${SESSION_API.UPDATE}/${editingSession.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editingSession)
                })

                if (res.status === 401) {
                    useAuth().logout()
                    throw new Error("UnAuthorized")
                }
                const data = await res.json()

                if (!res.ok) throw new Error(data.message || "Something went wrong")

                const status = data.status

                if (status) {
                    setEditiongSession({ name: "", start_date: "", end_date: "",id:"" , status:"" })
                    setIsAddOpen(false)
                    await getSessionData()
                    addToast({ title: "Session Updated", description: `${newSession.name} has been added.`, variant: "success" })
                } else {
                    const message = data.message
                    console.log(message)
                    addToast({ title: "Error", description: message, variant: "destructive" })
                }
            }
        }catch(error:any){
            console.log({"error":error.message||"Something went wrong"})
        }finally{
            setBtnLoading(false)
            setIsAddOpen(false)
        }
       
    }

    const handleDelete = async (id: string) => {
        try {
            setBtnLoading(true)

            const token = localStorage.getItem(StorageKey.TOKEN)

            const res = await fetch(
                `${API_BASE_URL}${SESSION_API.DELETE}/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            if (res.status === 401) {
                useAuth().logout()
                throw new Error("UnAuthorized")
            }

            const data = await res.json()

            if (!res.ok) throw new Error(data.message || "Something went wrong")

            const status = data.status

            if (status) {
                await getSessionData()

                addToast({
                    title: "Session Deleted",
                    description: "Session has been removed successfully.",
                    variant: "destructive"
                })
            } else {
                addToast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive"
                })
            }

        } catch (error: any) {
            console.log({ error: error.message || "Something went wrong" })
        } finally {
            setBtnLoading(false)
        }
    }


    const getSessionData = async () => {
        setIsLoading(true)
        setSessions(await getSessions()??[])
        setIsLoading(false)
    }

    useEffect(() => {
    
        getSessionData()
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Academic Sessions</h3>
                    <p className="text-sm text-muted-foreground">Manage semesters, terms, and academic calendars</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={(v)=>{
                    setMode("add")
                    setIsAddOpen(v)
                }}>
                    <DialogTrigger asChild><Button className="gap-2"><CalendarDays className="h-4 w-4" />New Session</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="sr-only"></DialogTitle>
                        <DialogHeader><DialogTitle>Create Session</DialogTitle><DialogDescription>Add a new academic session.</DialogDescription></DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2"><Label>Session Name</Label><Input value={ mode === "add" ? newSession.name:editingSession.name} onChange={(e) => {
                                mode === "add" ? setNewSession({ ...newSession, name: e.target.value }):
                                setEditiongSession({...editingSession,name:e.target.value}) 
                            }} placeholder="e.g. Summer 2026" /></div>
                            <div className="grid grid-cols-3 gap-4 ">
                                <div className="flex flex-col gap-2"><Label>Start Date</Label><Input min={today}type="date" value={mode === "add" ?newSession.start_date:editingSession.start_date} onChange={(e) =>{
                                    mode === "add" ? setNewSession({ ...newSession, start_date: e.target.value }):
                                    setEditiongSession({...editingSession,start_date: e.target.value})
                                }} /></div>
                                <div className="flex flex-col gap-2"><Label>End Date</Label><Input type="date" min={today} value={mode === "add" ? newSession.end_date : editingSession.end_date} onChange={(e) => {
                                    mode === "add" ? setNewSession({ ...newSession, end_date: e.target.value }) :
                                    setEditiongSession({...editingSession, end_date : e.target.value})
                                }} /></div>
                                {mode === "edit" && (
                                    <div className="flex flex-col gap-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={editingSession.status}
                                            onValueChange={(value) =>
                                                setEditiongSession({ ...editingSession, status: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col gap-4 sm:flex-row">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
                            <Button onClick={handleAdd} disabled={mode === "add" ? !newSession.name : !editingSession.name}>
                                {btnLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {mode!=="add" ? "Update..." : "Create..."}
                                    </>
                                ) : (
                                        mode !== "add" ? "Update" : "Create"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {
                    isLoading ? (<CircularLoader />) : (
                        sessions.length > 0 ? (
                            sessions.map((session) => (
                                <Card key={session.id} className={session.status === "active" ? "border-primary/30" : ""}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base">{session.name}</CardTitle>
                                            <div className="flex items-center gap-1">
                                                <Badge className={session.status === "active" ? "bg-primary/15 text-primary border-primary/20" : session.status === "upcoming" ? "bg-accent/15 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </Badge>
                                                <Button variant="ghost" disabled={btnLoading} size="icon" className="h-7 w-7" onClick={() =>{
                                                    setEditiongSession(session)
                                                    setMode("edit")
                                                    setIsAddOpen(true)
                                                }}><SquarePen className="h-3.5 w-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(session.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-row gap-4 justify-between items-end">
                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>Start: {session.start_date}</span></div>
                                                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>End: {session.end_date}</span></div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>{session.student_count} Students</span>
                                            </div>
                                        </div>


                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                    <GraduationCap className="h-10 w-10 mb-4 opacity-40" />
                                    <p className="text-sm font-medium">No Session found</p>
                                    <p className="text-xs">Create one to get started</p>
                                </div>
                        )
                    )
                }
            </div>
        </div>
    )
}