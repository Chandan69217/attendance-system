"use client"

import { AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppState } from "@/lib/app-state"
import { Department } from "@/lib/types"
import { Building2, GraduationCap, SquarePen, Trash2, Users } from "lucide-react"
import { useState } from "react"



export function DepartmentManagement() {

  const { departments, setDepartments, addToast } = useAppState()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDept, setNewDept] = useState({ name: "", head: "" })

  const handleAdd = () => {
    if (!newDept.name) return
    setDepartments((prev) => [...prev, { id: `D${Date.now()}`, name: newDept.name, head: newDept.head, studentCount: 0, facultyCount: 0 }])
    setNewDept({ name: "", head: "" })
    setIsAddOpen(false)
    addToast({ title: "Department Added", description: `${newDept.name} has been created.`, variant: "success" })
  }

  const handleDelete = (id: string) => {
    const d = departments.find((d) => d.id === id)
    setDepartments((prev) => prev.filter((d) => d.id !== id))
    addToast({ title: "Department Removed", description: `${d?.name} has been deleted.`, variant: "destructive" })
  }

  const handleUpdate = (dept: Department)=>{


  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Department Management</h3>
          <p className="text-sm text-muted-foreground">Manage departments and assign department heads</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Building2 className="h-4 w-4" />Add Department</Button></DialogTrigger>
          <DialogContent>
            <DialogTitle className="sr-only"></DialogTitle>
            <DialogHeader><DialogTitle>Add Department</DialogTitle><DialogDescription>Create a new academic department.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"><Label>Department Name</Label><Input value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} placeholder="e.g. Electronics" /></div>
              <div className="flex flex-col gap-2"><Label>Department Head</Label><Input value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} placeholder="e.g. Dr. John Smith" /></div>
            </div>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAdd} disabled={!newDept.name}>Create</Button>
            </AlertDialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
                <div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdate(dept)}><SquarePen className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(dept.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardTitle className="text-base">{dept.name}</CardTitle>
              <CardDescription>Head: {dept.head || "Not assigned"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><GraduationCap className="h-4 w-4" /><span>{dept.studentCount} Students</span></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /><span>{dept.facultyCount} Faculty</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}