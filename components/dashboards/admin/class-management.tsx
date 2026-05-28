"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularLoader } from "@/components/ui/circular-loader"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchSelect } from "@/components/ui/search-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppState } from "@/lib/app-state"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, CLASS_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Class, Department, User } from "@/lib/types"
import { deleteClass, getClasses } from "@/service/classes.service"
import { getDepartments } from "@/service/dept.service"
import { getFilterUsers } from "@/service/users.service"
import { Users, GraduationCap, SquarePen, Trash2, School, Loader2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"





export function ClassManagement() {
    const { addToast } = useAppState()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<any>()
    const [mode, setMode] = useState<"add" | "edit">("add")
    const [classes,setClasses] = useState<Class[]>([])
    const [departments,setDepartments] = useState<Department[]>([])
    const [filterDept, setFilterDept] = useState("all")
    const [isLoading,setLoading] = useState(false)

    const filteredClasses =
        filterDept === "all"
            ? classes
            : classes.filter((c: any) => {
                return c.dept_id === filterDept
            })


    const fetchData = async () => {
        try {
            setLoading(true)
            const classes = await getClasses()
            const dept = await getDepartments()
            setClasses(classes)
            setDepartments(dept)
        } catch (error: any) {
            console.error(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
       
        fetchData()
    }, [])

    const handleSubmit =async (data: {
        name: string
        dept_id: string
        class_teacher_id: string
    }) => {
        if (!data.name) return

        if (mode === "add") {

            await fetchData()

            addToast({
                title: "Class Created",
                description: `${data.name} has been added.`,
                variant: "success",
            })
        }

        if (mode === "edit" && selectedClass) {

            await fetchData()
            addToast({
                title: "Class Updated",
                description: `${data.name} has been updated.`,
                variant: "success",
            })
        }

        setIsOpen(false)
        setSelectedClass(undefined)
        setMode("add")
    }

    const handleDelete = async(id: string) => {
       const c = classes.find((c: any) => c.id === id)
       if(await deleteClass(id) ){
           setClasses((prev: any) =>
               prev.filter((c: any) => c.id !== id)
           )
           addToast({
               title: "Class Deleted",
               description: `${c?.name} has been removed.`,
               variant: "destructive",
           })
       }else{
           addToast({
               title: "Error",
               description: `${c?.name} has not been removed.`,
               variant: "destructive",
           })
       }
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        Class Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage academic classes and assign teachers
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setIsOpen(true)
                        setMode("add")
                        setSelectedClass(undefined)
                    }}
                    className="gap-2"
                >
                    <School className="h-4 w-4" />
                    Add Class
                </Button>
            </div>

            <AddUpdateClass
                open={isOpen}
                setOpen={setIsOpen}
                data={selectedClass}
                mode={mode}
                onSubmit={handleSubmit}
            />

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <Label>Filter by Department</Label>
                        <Select value={filterDept} onValueChange={setFilterDept}>
                            <SelectTrigger className="w-full sm:w-60">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map((d: any) => (
                                    <SelectItem key={d.id} value={d.id}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>


            {/* Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {isLoading ? (
                    <CircularLoader />
                ) : filteredClasses.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                            <School className="h-10 w-10 mb-4 opacity-40" />
                            <p className="text-sm font-medium">No Classes found</p>
                            <p className="text-xs">Create one to get started</p>
                        </div>
                ) : (
                    filteredClasses.map((cls: any) => (
                        <Card key={cls.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                    </div>

                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIsOpen(true)
                                                setMode("edit")
                                                setSelectedClass(cls)
                                            }}
                                        >
                                            <SquarePen className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDelete(cls.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <CardTitle className="text-base">
                                    {cls.name}
                                </CardTitle>

                                <CardDescription>
                                    Class Teacher: {cls.class_teacher || "Not assigned"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{cls.student_count || 0} Students</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

        </div>
    )
}




interface AddUpdateClassProps {
    open: boolean
    setOpen: (open: boolean) => void
    data?: any
    mode: "add" | "edit"
    onSubmit: (data: {
        name: string
        dept_id: string
        class_teacher_id: string
    }) => void

}

function AddUpdateClass({
    open,
    setOpen,
    data,
    mode,
    onSubmit,
}: AddUpdateClassProps) {

    const isEdit = Boolean(data?.id)
    const [ departments,setDepartments ] = useState<Department[]>([])
    const [users,setUsers] = useState<User[]>([])
    const [searchTerm,setSearchTerm] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)
    const [isLoading ,setLoading] = useState(false)
    const [error,setError] = useState("")

    const [form, setForm] = useState({
        name: "",
        dept_id: "",
        class_teacher_id: "",
    })


    const filterUser = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()

        if (!term) return users

        return users.filter((u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.id.toLowerCase().includes(term)
        )
    }, [users, searchTerm])


    useEffect(() => {
        if (!searchTerm.trim()) {
            setForm((prev) => ({
                ...prev,
                class_teacher_id: ""
            }))
        }
    }, [searchTerm])

    useEffect(()=>{
        const fetchData = async ()=>{
            setUsers(await getFilterUsers({ search: 'faculty' }))
            setDepartments(await getDepartments())
        }
        fetchData()
    },[])


    useEffect(() => {
        
        if (mode === "add") {
            setForm({
                name: "",
                dept_id: "",
                class_teacher_id: "",
            })
            return
        }

        if (mode === "edit" && data) {
            const user = users.find((u) => u.id === data.class_teacher_id)
            setForm({
                name: data.name,
                dept_id: data.dept_id,
                class_teacher_id: data.class_teacher_id,
            })
           
            setSearchTerm(user?.name ?? "")
        }

    }, [mode, data, users,departments])


      const handleSubmit = async () => {
    
        if (!form.name) return

        setError("")
    
        const { name,dept_id,class_teacher_id } = form;
    
    
        if (mode === "add") {
    
          try {
            setLoading(true)
            const token = localStorage.getItem(StorageKey.TOKEN);
           
            const res = await fetch(`${API_BASE_URL}${CLASS_API.CREATE}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ name,dept_id,class_teacher_id }),
            });
    
            const data = await res.json();
    
            if(res.status ===401){
              useAuth().logout()
            }
          
            if (!res.ok) {
              setError(data.message || "Something went wrong");
              setLoading(false)
              return
            }

            if (!data.status) {
              setError(data.message);
              setLoading(false)
              return
            }
    
            setOpen(false);
            onSubmit(form)
    
          } catch (error: any) {
            console.error("Create Class Error:", error);
            setError(error.message || "Failed to create Class");
    
          }
          setLoading(false)
          setForm({
            "name": "",
            "dept_id": "",
           "class_teacher_id": ""
          })
          setSearchTerm("")
        }
    
    
    
        if (mode === 'edit' && data) {
    
          try {
            setLoading(true)
            
            const {name,dept_id,class_teacher_id} = form
            const token = localStorage.getItem(StorageKey.TOKEN)
    
            if (!token) {
              console.error("Token missing")
              return
            }
    
            const res = await fetch(
              `${API_BASE_URL}${CLASS_API.UPDATE}/${data.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name,dept_id,class_teacher_id }),
              }
            )
    
            const body = await res.json()
    
            if (res.status === 401) {
              console.log("Unauthorized")
              useAuth().logout()
              return
            }
    
            if (!res.ok) {
              console.error(body.message || "Update failed")
              return
            }
    
            if (body.status) {
              onSubmit(form)
              setOpen(false)
            }
    
    
          } catch (error: any) {
            console.log({ error: error.message })
          }
    
          setLoading(false)
        }
        
      }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Class" : "Add Class"}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription>
                            {isEdit
                              ? "Update class details."
                              : "Create a new class."}
                          </DialogDescription>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Class Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Department</Label>
                        <Select
                            value={form.dept_id}
                            onValueChange={(value) =>
                                setForm({ ...form, dept_id: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((d: any) => (
                                    <SelectItem key={d.id} value={d.id}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    

                    <div className="flex flex-col gap-2">

                        <SearchSelect
                            onChange={setSearchTerm}
                            onSelect={(u) => {
                                setSearchTerm(u.name)
                                setForm((prev) => ({
                                    ...prev,
                                    class_teacher_id: u.id
                                }))
                            }}
                            setShowOverlay={setShowOverlay}
                            showOverlay={showOverlay}
                            users={filterUser}
                            placeHolder="Search class teacher"
                            hideCard={true}
                            value={searchTerm}
                        />
                        
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!form.name}>
                       {isLoading ? (
                                     <>
                                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                       {isEdit ? "Update..." : "Create..."}
                                     </>
                                   ) : (
                                     isEdit ? "Update" : "Create"
                                   )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
