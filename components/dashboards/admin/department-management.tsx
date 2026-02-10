"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppState } from "@/lib/app-state"
import { Department } from "@/lib/types"
import { Building2, GraduationCap, SquarePen, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"



export function DepartmentManagement() {

  const { departments, setDepartments, addToast } = useAppState()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department|undefined>()
  const [mode,setMode] = useState<"add"|"edit">("add")


  const handleSubmit = (data:{name:string,head:string}) => {
    if (!data.name) return
    if(mode === 'add'){
      const newDept:Department = {
        id : `D${Date.now()}`,
        name : data.name,
        head : data.head,
        facultyCount :0,
        studentCount :0
      } 
      setDepartments((prev) => [...prev,newDept])

      setIsOpen(false)
      addToast({ title: "Department Added", description: `${newDept.name} has been created.`, variant: "success" })
    }

    if(mode === 'edit' && selectedDept){
      setDepartments((prev)=>prev.map(
        (d)=> d.id === selectedDept.id ? {
          ...d,name:data.name,head:data.head
        }:d
      ))

      addToast({
        title: "Department Updated",
        description: `${data.name} has been updated.`,
        variant: "success",
      })
    }

    setMode('add')
    setIsOpen(false)
    setSelectedDept(undefined)
    
  }


  const handleDelete = (id: string) => {
    const d = departments.find((d) => d.id === id)
    setDepartments((prev) => prev.filter((d) => d.id !== id))
    addToast({ title: "Department Removed", description: `${d?.name} has been deleted.`, variant: "destructive" })
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Department Management</h3>
          <p className="text-sm text-muted-foreground">Manage departments and assign department heads</p>
        </div>
        <Button onClick={()=>{
          setIsOpen(true)
          setMode('add')
          setSelectedDept(undefined)
        }}className="gap-2"><Building2 className="h-4 w-4" />Add Department</Button>
      </div>
        <AddUpdate  setOpen={setIsOpen} open={isOpen} mode={mode} data= {selectedDept} onSubmit={handleSubmit}/>
      <div className="grid gap-4 md:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
                <div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                    setIsOpen(true)
                    setMode('edit')
                    setSelectedDept(dept)
                  }}><SquarePen className="h-4 w-4" /></Button>
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


interface AddUpdateProps {
  open: boolean
  setOpen: (open: boolean) => void
  data?: Department
  mode: "add"|"edit"
  onSubmit: (data:{name:string,head:string}) => void
}

function AddUpdate({
  open,
  setOpen,
  data,
  onSubmit,
}: AddUpdateProps) {
  const isEdit = Boolean(data?.id)

  const [form, setForm] = useState({
    name: "",
    head: "",
  })


  useEffect(() => {
    if(data){
      setForm({
        name:data.name,
        head:data.head
      })
    }else{
      setForm({
        name:"",
        head:""
      })
    }
  }, [data, open])

  const handleClose = () => {
    setOpen(false)
    setForm({ name: "", head: "" })
  }


  const handleSubmit = () => {
    onSubmit(form)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Department" : "Add Department"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update department details."
              : "Create a new academic department."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Department Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="e.g. Electronics"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Department Head</Label>
            <Input
              value={form.head}
              onChange={(e) =>
                setForm({ ...form, head: e.target.value })
              }
              placeholder="e.g. Dr. John Smith"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!form.name}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}





