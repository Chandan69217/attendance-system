"use client"

import { useAppState } from "@/lib/app-state"
import { useEffect, useState } from "react"
import { Class, Department, Role, User,UserStatus} from "@/lib/types"
import { DialogFooter, Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserX2, UserPen, Users, GraduationCap, Search, UserPlus, Trash2, CheckCircle2, Eye, Building2, CalendarDays, Ban, RotateCcw, Mail, Phone, Loader2, } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableCell, TableRow, TableHeader } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { deleteUser, getFilterUsers, updateUser } from "@/service/users.service"
import { CircularLoader } from "@/components/ui/circular-loader"
import { StorageKey } from "@/lib/constants"
import { API_BASE_URL, AUTH_API, USER_API } from "@/lib/config"
import { useAuth } from "@/lib/auth-context"
import { formatDateTime } from "@/lib/utils"
import { getDepartments } from "@/service/dept.service"
import { getClasses } from "@/service/classes.service"




const emptyUser: User = {
    id: "",
    name: "",
    email: "",
    role: "student",
    department: "",
    class: "",
    phone: ""
}


export function UserManagement() {
    const { addToast } = useAppState()

    const [users, setUsers] = useState<User[]>([])


    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")



    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)

    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
    const [viewUser, setViewUser] = useState<User | null>(null)
    const [editingUser, setEditingUser] = useState<User>(emptyUser)

    const [isLoading, setIsLoading] = useState(false)

    const filteredUsers = users.filter((u) =>
        (u.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())) &&
        (roleFilter === "all" || u.role === roleFilter) &&
        (statusFilter === "all" || u.status === statusFilter)
    )

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    const [ studentCount,setStudentCount] = useState(0)
    const [facultyCount, setfacultyCount] = useState(0)
    const [activeCount, setActiveCount] = useState(0)



    const getUser = async (role: string) => {
        setIsLoading(true)
        setUsers(await getFilterUsers({ "search": role }))
        setIsLoading(false)
    }




    useEffect(()=>{
        const getStatus = async ()=>{
            try {
                const token = localStorage.getItem(StorageKey.TOKEN)

                const res = await fetch(`${API_BASE_URL}${USER_API.USER_STATS}`, {
                    method: "GET",
                    headers: {
                        "Content-type": 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                })

                if(res.status == 401){
                    useAuth().logout()
                }

                if(!res.ok) throw new Error("Something went wrong")

                const data = await res.json()

                setStudentCount( data.data['student_count'])
                setfacultyCount( data.data['faculty_count'])
                setActiveCount(data.data['active_count'])

            } catch (error: any) {
                console.error(error)
            }
        }
        getStatus()
    },[users])
    
    useEffect(() => {
        getUser(roleFilter)
    }, [roleFilter])

    const handleToggleStatus = async (id: string) => {
        
        try {
            const user = users.find((u) => u.id === id)
    
            const toggle_staus: UserStatus =
                user?.status === "active"
                    ? "suspended"
                    : "active"

    
            const updated_user = await updateUser(id,{"status":toggle_staus})
            if(updated_user){
                await getUser(roleFilter)
                addToast({ title:toggle_staus, description: `${user?.name}'s account has been updated.`, variant: "default" })
            }

        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const handleDeleteUser = async (id: string) => {
        try {
            const deleted_user = await deleteUser(id)

            if (deleted_user) {
                await getUser(roleFilter)

                addToast({
                    title: "User Deleted",
                    description: `${deleted_user?.name ?? "User"} has been removed from the system.`,
                    variant: "destructive"
                })
            }

        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message || "Failed to delete user",
                variant: "destructive"
            })
        }
    }



    const openAddDialog = () => {
        setDialogMode("add")
        setEditingUser(emptyUser)
        setIsAddOpen(true)
    }

    const openEditDialog = (user: User) => {
        setDialogMode("edit")
        setIsViewOpen(false)
        setEditingUser(user)
        setIsAddOpen(true)
    }

    const handleSubmit = async (form:User) => {
        setIsAddOpen(false)
        if (dialogMode === "add") {
            await getUser(roleFilter)
            addToast({
                title: "User Created",
                description: `${form.name} added successfully.`,
                variant: "success"
            })
        } else {
            await getUser(roleFilter)
            addToast({
                title: "Changes Saved",
                description: `${form.name} updated successfully.`,
                variant: "success"
            })
        }

    }


    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage students, faculty, and admins
                    </p>
                </div>
                <Button onClick={openAddDialog} className="gap-2"><UserPlus className="h-4 w-4" />Add User</Button>

            </div>

            <AddUpdateUser
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                user={editingUser}
                mode={dialogMode}
                onSubmit={handleSubmit}
            />

            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { label: "Students", value: studentCount, icon: GraduationCap, cls: "text-primary" },
                    { label: "Faculty", value: facultyCount, icon: Users, cls: "text-accent" },
                    { label: "Active Users", value: activeCount, icon: CheckCircle2, cls: "text-chart-2" },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="flex items-center gap-3 p-4">
                            <s.icon className={`h-5 w-5 ${s.cls}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="text-lg font-bold text-card-foreground">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search by name or email..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="faculty">Faculty</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0 flex flex-col justify-between">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (

                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="flex h-full items-center justify-center gap-2">
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            <p>Loading...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>


                            ) : (
                                filteredUsers.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No users found</TableCell></TableRow>
                                ) : paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>  
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                                        <TableCell className="text-sm">{user.department??"N/A"}</TableCell>
                                        <TableCell>
                                            <Badge className={user.status === "active" ? "bg-primary/15 text-primary border-primary/20" : user.status === "suspended" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                                                {user.status?.charAt(0).toUpperCase()}{user.status?.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{user.join_date?.split("T")[0]}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewUser(user); setIsViewOpen(true) }}>
                                                    <Eye className="h-4 w-4" /><span className="sr-only">View details</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleStatus(user.id)}>
                                                    {user.status === "active" ? <Ban className="h-4 w-4 text-chart-3" /> : <RotateCcw className="h-4 w-4 text-primary" />}
                                                    <span className="sr-only">{user.status === "active" ? "Suspend" : "Activate"}</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                    <Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {!isLoading&&paginatedUsers.length > 0 && <Pagination className="my-4">
                        <PaginationContent>

                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCurrentPage((p) => Math.max(p - 1, 1))
                                    }}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, index) => {
                                const page = index + 1
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === page}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setCurrentPage(page)
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                                    }}
                                    className={
                                        currentPage === totalPages || totalPages === 0
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />

                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>}

                </CardContent>
            </Card>


            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogTitle className="sr-only"></DialogTitle>
                    <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
                    {viewUser && (
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between gap-4">
                                <div className="flex gap-4 items-center">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{viewUser.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">{viewUser.name}</p>
                                        <Badge variant="secondary" className="mt-1 capitalize">{viewUser.role}</Badge>
                                    </div>
                                </div>
                                <Button
                                    variant={'ghost'}
                                    size="icon"
                                    onClick={() => openEditDialog(viewUser)}>
                                    <UserPen className="h-4 w-4" />
                                </Button>

                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span>{viewUser.email}</span></div>
                                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{viewUser.phone ?? "N/A"}</span></div>
                                <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-muted-foreground" /><span>{viewUser.department??'N/A'}</span></div>
                                <div className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-muted-foreground" /><span>Joined: {formatDateTime(viewUser.join_date??"")}</span></div>
                            </div>
                            {viewUser.class && <p className="text-sm text-muted-foreground">Class: {viewUser.class}</p>}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}




interface AddUpdateUserProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User
    mode: 'add' | 'edit'
    onSubmit: (form: User) => Promise<void>
}





function AddUpdateUser({
    open,
    onOpenChange,
    user,
    mode,
    onSubmit
}: AddUpdateUserProps) {

    const [departments, setDepartments] = useState<Department[]>([])
    const [classes, setClasses] = useState<Class[]>([])
    const [selectedDept, setSelectedDept] = useState<string | null>(null)
    const [error,setError]= useState<string>()
    const [isLoading,setIsLoading]= useState(false)
    const [form,setForm] = useState<User>(user)

 
    useEffect(() => {
        setForm(user)
        setSelectedDept(user?.dept_id || null)
    }, [user])


    useEffect(() => {
        const loadData = async () => {
            try {
                const deptData = await getDepartments()
                const classData = await getClasses()

                setDepartments(deptData)
                setClasses(classData)
            } catch (err: any) {
                setError("Failed to load data")
            }
        }
        loadData()
    }, [])

    const filteredClasses =
        selectedDept
            ? classes.filter((c) => c.dept_id === selectedDept)
            : []


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {

            if (!form.name || !form.email) {
                throw new Error("Name and Email are required")
            }

            if (!form.phone) {
                throw new Error("Phone is required")
            }

            if (form.role === "student" && !form.class_id) {
                throw new Error("Class is required for students")
            }

            if (form.role === "faculty" && !form.dept_id) {
                throw new Error("Class is required for students")
            }

            if(mode === "add"){
                const token = localStorage.getItem(StorageKey.TOKEN)

                const res = await fetch(`${API_BASE_URL}${AUTH_API.REGISTER}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                })

                if (res.status === 401) {
                    useAuth().logout()
                    throw new Error("Unauthorized")
                }

                const data = await res.json()

                if (!res.ok) throw new Error(data.message || "Something went wrong")

                const status = data.status

                if (status) {
                    onSubmit(form)
                } else {
                    const message = data.message
                    setError(message)
                }
            }else{
                const updated_user =  await updateUser(form.id,form)

                if(updated_user){
                    const status = updated_user["status"]??false
                    if(status){
                        onSubmit(form)
                    }else{
                        setError(updated_user['message']??"")
                    }
                }
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add New User" : "Edit User"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Create a new account."
                            : "Update user details."}
                    </DialogDescription>
                </DialogHeader>
                {error && (
                    <div className=" p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <Label>Full Name</Label>
                        <Input
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Phone</Label>
                        <Input
                            type="phone"
                            required
                            placeholder="Phone"

                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex flex-col gap-2">
                            <Label>Role</Label>
                            <Select
                                name="role"
                                value={form.role}
                                onValueChange={(v) =>
                                    setForm({ ...form, role: v as Role })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="faculty">Faculty</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Department</Label>
                            <Select
                                name="department"
                                disabled={form.role === "admin"}
                                required={form.role !== "admin"}
                                value={form.dept_id}
                                onValueChange={(v) => {
                                    setSelectedDept(v)
                                    setForm({
                                        ...form,
                                        dept_id: v,
                                        class_id: ""
                                    })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem key={d.id} value={d.id}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                    {form.role === "student" && (
                        <div className="flex flex-col gap-2">
                            <Label>Class</Label>
                            <Select
                                name="class"
                                required={form.role === "student"}
                                value={form.class_id}
                                onValueChange={(v) =>
                                    setForm({ ...form, class_id: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredClasses.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                </div>

                <DialogFooter className="mt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={!form.name || !form.email}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {"Save..."}
                            </>
                        ) : (
                            mode === "edit" ? "Save Changes" : "Add User"
                        )}

                    </Button>
                </DialogFooter> 
               
            </DialogContent>
        </Dialog>
    )
}






