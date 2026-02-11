"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppState } from "@/lib/app-state"
import { Users, GraduationCap, SquarePen, Trash2, School } from "lucide-react"
import { useEffect, useState } from "react"





export function ClassManagement() {
    const { classes,departments, setClasses, addToast } = useAppState()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<any>()
    const [mode, setMode] = useState<"add" | "edit">("add")

    const [filterDept, setFilterDept] = useState("all")

    const filteredClasses =
        filterDept === "all"
            ? classes
            : classes.filter((c: any) => c.department === filterDept)


    const handleSubmit = (data: {
        name: string
        department: string
        classTeacher: string
    }) => {
        if (!data.name) return

        if (mode === "add") {
            const newClass = {
                id: `C${Date.now()}`,
                ...data,
                studentCount: 0,
            }

            setClasses((prev: any) => [...prev, newClass])

            addToast({
                title: "Class Created",
                description: `${data.name} has been added.`,
                variant: "success",
            })
        }

        if (mode === "edit" && selectedClass) {
            setClasses((prev: any) =>
                prev.map((c: any) =>
                    c.id === selectedClass.id ? { ...c, ...data } : c
                )
            )

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

    const handleDelete = (id: string) => {
        const c = classes.find((c: any) => c.id === id)

        setClasses((prev: any) =>
            prev.filter((c: any) => c.id !== id)
        )

        addToast({
            title: "Class Deleted",
            description: `${c?.name} has been removed.`,
            variant: "destructive",
        })
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
                                    <SelectItem key={d.id} value={d.name}>
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
                {filteredClasses.map((cls: any) => (
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
                                {cls.name} - {cls.section}
                            </CardTitle>
                            <CardDescription>
                                Class Teacher: {cls.classTeacher || "Not assigned"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{cls.studentCount} Students</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
        department: string
        classTeacher: string
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
    const { departments, } = useAppState()

    const [form, setForm] = useState({
        name: "",
        department: "",
        classTeacher: "",
    })


    useEffect(() => {
        if (data) {
            setForm({
                name: data.name,
                department: data.department,
                classTeacher: data.classTeacher,
            })
        } else {
            setForm({
                name: "",
                department: "",
                classTeacher: "",
            })
        }
    }, [data, open])


    const handleSubmit = () => {
        onSubmit(form)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Class" : "Add Class"}
                    </DialogTitle>
                </DialogHeader>

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
                            value={form.department}
                            onValueChange={(value) =>
                                setForm({ ...form, department: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((d: any) => (
                                    <SelectItem key={d.id} value={d.name}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    {/* <div className="flex flex-col gap-2">
                        <Label>Section</Label>
                        <Input
                            value={form.section}
                            onChange={(e) =>
                                setForm({ ...form, section: e.target.value })
                            }
                        />
                    </div> */}

                    <div className="flex flex-col gap-2">
                        <Label>Class Teacher</Label>
                        <Input
                            value={form.classTeacher}
                            onChange={(e) =>
                                setForm({ ...form, classTeacher: e.target.value })
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!form.name}>
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
