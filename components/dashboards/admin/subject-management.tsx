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
import { API_BASE_URL, SUBJECT_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Department, Subject } from "@/lib/types"
import { getDepartments } from "@/service/dept.service"
import { getSubjects } from "@/service/subject.service" 
import { CalendarDays, GraduationCap, Loader2, SquarePen, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export function SubjectManagement() {
    const { addToast } = useAppState()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newSubject, setNewSubject] = useState({ name: "",dept_id: "" })
    const [editingSubject, setEditiongSubject] = useState({ name: "",id:"",dept_id:"", })
    const [isLoading, setIsLoading] = useState(false)
    const [Subjects, setSubjects] = useState<Subject[]>([])
    const [mode , setMode] = useState("add")
    const [btnLoading , setBtnLoading] = useState(false)
    const [departments, setDepartments] = useState<Department[]>([])
    const [selectedDept , setSelectedDept] = useState<string>("All")

    useEffect(()=>{
        const load = async ()=>{
            setDepartments(await getDepartments())
        } 
        load()
    },[])


    const filteredSubjects =
        selectedDept === "All"
            ? Subjects
            : Subjects.filter((c) => c.dept_id === selectedDept)


    const handleAdd = async() => {
        // if ((!newSubject.name || !editingSubject.name) && (!newSubject.start_date || !editingSubject.start_date)) return
        try{
            setBtnLoading(true)
            const token = localStorage.getItem(StorageKey.TOKEN)
            if(mode==="add"){
           
                const res = await fetch(`${API_BASE_URL}${SUBJECT_API.CREATE}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newSubject)
                })

                if (res.status === 401) {
                    useAuth().logout()
                    throw new Error("UnAuthorized")
                }
                const data = await res.json()

                if (!res.ok) throw new Error(data.message || "Something went wrong")

                console.log(data)
                const status = data.status

                if (status) {
                    setNewSubject({ name: "", dept_id: "",})
                    setIsAddOpen(false)
                    await getSubjectData()
                    addToast({ title: "Subject Created", description: `${newSubject.name} has been added.`, variant: "success" })
                } else {
                    const message = data.message
                    console.log(message)
                    addToast({ title: "Error", description: message, variant: "destructive" })
                }
            }else if(mode === "edit"){
                const res = await fetch(`${API_BASE_URL}${SUBJECT_API.UPDATE}/${editingSubject.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editingSubject)
                })

                if (res.status === 401) {
                    useAuth().logout()
                    throw new Error("UnAuthorized")
                }
                const data = await res.json()

                if (!res.ok) throw new Error(data.message || "Something went wrong")

                const status = data.status

                if (status) {
                    setEditiongSubject({ name: "", dept_id: "",id:"" })
                    setIsAddOpen(false)
                    await getSubjectData()
                    addToast({ title: "Subject Updated", description: `${newSubject.name} has been added.`, variant: "success" })
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
                `${API_BASE_URL}${SUBJECT_API.DELETE}/${id}`,
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
                await getSubjectData()

                addToast({
                    title: "Subject Deleted",
                    description: "Subject has been removed successfully.",
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


    const getSubjectData = async () => {
        setIsLoading(true)
        setSubjects(await getSubjects()??[])
        setIsLoading(false)
    }

    useEffect(() => {
    
        getSubjectData()
    }, [])

    

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Academic Subjects</h3>
                    <p className="text-sm text-muted-foreground">Manage semesters, terms, and academic calendars</p>
                </div>

                <div className="flex flex-row gap-4">

                    <Select
                        name="department"
                        value={selectedDept}
                        onValueChange={(v) => {
                            setSelectedDept(v)

                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All"> All </SelectItem>
                            {departments.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button className="gap-2" onClick={() => {
                        setIsAddOpen(true)
                    }}><CalendarDays className="h-4 w-4" />New Subject</Button>

                </div>

               
               
            </div>

            <Dialog open={isAddOpen} onOpenChange={(v) => {
                setMode("add")
                setIsAddOpen(v)
            }}>

                <DialogContent>
                    <DialogTitle className="sr-only"></DialogTitle>
                    <DialogHeader><DialogTitle>Create Subject</DialogTitle><DialogDescription>Add a new cource Subject.</DialogDescription></DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2"><Label>Subject Name</Label><Input value={mode === "add" ? newSubject.name : editingSubject.name} onChange={(e) => {
                            mode === "add" ? setNewSubject({ ...newSubject, name: e.target.value }) :
                                setEditiongSubject({ ...editingSubject, name: e.target.value })
                        }} placeholder="subject name" /></div>

                        <div className="flex flex-col gap-2">
                            <Label>Select Department</Label>
                            <Select
                                value={mode === "add" ? newSubject.dept_id : editingSubject.dept_id}
                                onValueChange={(e) => {

                                    mode === "add" ? setNewSubject({ ...newSubject, dept_id: e }) :
                                        setEditiongSubject({ ...editingSubject, dept_id: e })
                                }
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        departments.map((d) =>
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <DialogFooter className="flex flex-col gap-4 sm:flex-row">
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
                        <Button onClick={handleAdd} disabled={mode === "add" ? !newSubject.name : !editingSubject.name}>
                            {btnLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {mode !== "add" ? "Update..." : "Create..."}
                                </>
                            ) : (
                                mode !== "add" ? "Update" : "Create"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-3">
                {
                    isLoading ? (<CircularLoader />) : (
                        filteredSubjects.length > 0 ? (
                            filteredSubjects.map((Subject) => (
                                <Card key={Subject.id} >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base">{Subject.name}</CardTitle>
                                            <div className="flex items-center gap-1">
                                               
                                                <Button variant="ghost" disabled={btnLoading} size="icon" className="h-7 w-7" onClick={() =>{
                                                    setEditiongSubject(Subject)
                                                    setMode("edit")
                                                    setIsAddOpen(true)
                                                }}><SquarePen className="h-3.5 w-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(Subject.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-row gap-4 justify-between items-end">
                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                {/* <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>Start: {Subject.start_date}</span></div>
                                                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>End: {Subject.end_date}</span></div> */}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>{Subject.faculty_count} Facultys</span>
                                            </div>
                                        </div>


                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                    <GraduationCap className="h-10 w-10 mb-4 opacity-40" />
                                    <p className="text-sm font-medium">No Subject found</p>
                                    <p className="text-xs">Create one to get started</p>
                                </div>
                        )
                    )
                }
            </div>
        </div>
    )
}