"use client"

import { useAppState } from "@/lib/app-state"
import { useState } from "react"
import { Role, User } from "@/lib/types"
import { DialogFooter, Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserX2, UserPen, Users, GraduationCap, Search, UserPlus, Trash2, CheckCircle2, Eye, Building2, CalendarDays, Ban, RotateCcw, Mail, Phone, } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableCell, TableRow, TableHeader } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"




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
    const { users, setUsers, addToast } = useAppState()

    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")



    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)

    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
    const [viewUser, setViewUser] = useState<User | null>(null)
    const [editingUser, setEditingUser] = useState<User>(emptyUser)

   
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


    const studentCount = users.filter((u) => u.role === "student").length
    const facultyCount = users.filter((u) => u.role === "faculty").length
    const activeCount = users.filter((u) => u.status === "active").length

    const handleToggleStatus = (id: string) => {
            setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "suspended" as const : "active" as const } : u))
            const u = users.find((u) => u.id === id)
            addToast({ title: u?.status === "active" ? "User Suspended" : "User Activated", description: `${u?.name}'s account has been updated.`, variant: "default" })
        }

    const handleDeleteUser = (id: string) => {
        const u = users.find((u) => u.id === id)
        setUsers((prev) => prev.filter((u) => u.id !== id))
        addToast({ title: "User Deleted", description: `${u?.name} has been removed from the system.`, variant: "destructive" })
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

    const handleSubmit = () => {
        if (!editingUser.name || !editingUser.email) return

        if (dialogMode === "add") {
            const id = `${editingUser.role === "student" ? "S" :
                    editingUser.role === "faculty" ? "F" : "A"
                }${String(users.length + 1).padStart(3, "0")}`

            setUsers(prev => [
                ...prev,
                { ...editingUser, id, joinDate: "2026-02-06", status: "active" }
            ])

            addToast({
                title: "User Created",
                description: `${editingUser.name} added successfully.`,
                variant: "success"
            })
        } else {
            setUsers(prev =>
                prev.map(u => u.id === editingUser.id ? { ...u, ...editingUser } : u)
            )

            addToast({
                title: "Changes Saved",
                description: `${editingUser.name} updated successfully.`,
                variant: "success"
            })
        }

        setIsAddOpen(false)
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
                setUser={setEditingUser}
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
                            {filteredUsers.length === 0 ? (
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
                                    <TableCell className="text-sm">{user.department}</TableCell>
                                    <TableCell>
                                        <Badge className={user.status === "active" ? "bg-primary/15 text-primary border-primary/20" : user.status === "suspended" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                                            {user.status?.charAt(0).toUpperCase()}{user.status?.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>

                    {paginatedUsers.length >0 && <Pagination className="my-4">
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
                                    onClick={()=>openEditDialog(viewUser)}>
                                    <UserPen className="h-4 w-4" />
                                </Button>

                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span>{viewUser.email}</span></div>
                                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{viewUser.phone ?? "N/A"}</span></div>
                                <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-muted-foreground" /><span>{viewUser.department}</span></div>
                                <div className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-muted-foreground" /><span>Joined: {viewUser.joinDate}</span></div>
                            </div>
                            {viewUser.class && <p className="text-sm text-muted-foreground">Class: {viewUser.class}</p>}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
           
        </div>
    )
}




interface AddUpdateUserProps{
    open: boolean
    onOpenChange :(open:boolean)=>void
    user : User
    mode: 'add'|'edit'
    setUser : React.Dispatch<React.SetStateAction<User>>
    onSubmit:()=>void
}   

function AddUpdateUser({
    open,
    onOpenChange,
    user,
    mode,
    setUser,
    onSubmit
}: AddUpdateUserProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild/>
            <DialogContent>
                <DialogTitle className="sr-only"></DialogTitle>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add New User" : "Edit User"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Create a new account for a student, faculty member, or admin."
                            : "Update user details."
                        }

                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Full Name</Label>
                        <Input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Enter full name" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="user@university.edu" type="email" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Phone</Label>
                        <Input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="+1-555-0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Role</Label>
                            <Select value={user.role} onValueChange={(v) => setUser({ ...user, role: v as Role })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="faculty">Faculty</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Department</Label>
                            <Select value={user.department} onValueChange={(v) => setUser({ ...user, department: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                    <SelectItem value="Physics">Physics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {user.role === "student" && (
                        <div className="flex flex-col gap-2">
                            <Label>Class</Label>
                            <Select value={user.class} onValueChange={(v) => setUser({ ...user, class: v })}>
                                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CS-301">CS-301</SelectItem>
                                    <SelectItem value="CS-302">CS-302</SelectItem>
                                    <SelectItem value="MA-201">MA-201</SelectItem>
                                    <SelectItem value="PH-101">PH-101</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">Cancel</Button>
                    <Button onClick={onSubmit} disabled={!user.name || !user.email}>{mode == 'edit' ? "Save Change" : "Add User"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 



