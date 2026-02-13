"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularLoader } from "@/components/ui/circular-loader"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchSelect } from "@/components/ui/search-select"
import { useAppState } from "@/lib/app-state"
import { API_BASE_URL, DEPT_API, USER_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Department, User } from "@/lib/types"
import { Building2, GraduationCap, Loader2, SquarePen, Trash2, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/lib/auth-context"


export function DepartmentManagement() {

  const { addToast } = useAppState()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department|undefined>()
  const [mode,setMode] = useState<"add"|"edit">("add")
  const [error,setError] = useState("")
  const [isLoading , setIsLoading] = useState(false)
  const [departments,setDepartments] = useState<Department[]>([])
  const {logout} = useAuth()

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem(StorageKey.TOKEN)

      const res = await fetch(`${API_BASE_URL}${DEPT_API.GET_DEPT}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if(res.status === 401){
        logout()
      }

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong")
      }

      setDepartments(data.data)

    } catch (error: any) {
      console.error(error.message)
    }
    setIsLoading(false)
  }


  useEffect(() => {
    getUsers()
  }, [])



  const handleSubmit = async (data:{name:string,head_id:string}) => {
    if (!data.name) return

    const { name, head_id } = data;

    if (mode === "add") {
      try {
        await getUsers()
        addToast({
          title: "Department Added",
          description: `${name} has been created.`,
          variant: "success",
        });

      } catch (error: any) {
        console.error("Create Department Error:", error);
        setError(error.message || "Failed to create department");

      }
    }

    if(mode === 'edit' && selectedDept){

      await getUsers()

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


  const handleDelete = async (id: string) => {

    const d = departments.find((d) => d.id === id)

    try {
      const token = localStorage.getItem(StorageKey.TOKEN)

      if (!token) {
        console.error("Token missing")
        return
      }

      const res = await fetch(
        `${API_BASE_URL}${DEPT_API.DELETE}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      )

      const body = await res.json()

      if (res.status === 401) {
        console.log("Unauthorized")
        logout()
        return
      }

      if (!res.ok) {
        console.error(body.message || "Delete failed")
        return
      }

      if (body.status) {
        await getUsers()
        addToast({ title: "Department Removed", description: `${d?.name} has been deleted.`, variant: "destructive" })
      }
      
      
    } catch (error: any) {
      console.log({ error: error.message })
    }
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
        <AddUpdate setOpen={setIsOpen} open={isOpen} mode={mode} data= {selectedDept} onSubmit={handleSubmit}/>
      <div className="grid gap-4 md:grid-cols-3">
        {
          isLoading ? (
            <CircularLoader/>
          ) : departments.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Building2 className="h-10 w-10 mb-4 opacity-40" />
                <p className="text-sm font-medium">No departments found</p>
                <p className="text-xs">Create one to get started</p>
              </div>

          ) : (
            departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setIsOpen(true)
                          setMode("edit")
                          setSelectedDept(dept)
                        }}
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardTitle className="text-base">{dept.name}</CardTitle>
                  <CardDescription>
                    Head: {dept.head_name || "Not assigned"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{dept.student_count} Students</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{dept.faculty_count} Faculty</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )
        }
      </div>
    </div>
  )
}


interface AddUpdateProps {
  open: boolean
  setOpen: (open: boolean) => void
  data?: Department
  mode: "add"|"edit",
  onSubmit: (data:{name:string,head_id:string}) => void
}

function AddUpdate({
  open,
  setOpen,
  data,
  onSubmit,
  mode,
}: AddUpdateProps) {
  const isEdit = Boolean(data?.id)

  const [form, setForm] = useState({
    name: "",
    head_id: "",
  })

  const [isLoading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const [searchTerm, setSearchTerm] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const {logout} = useAuth()

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
        head_id: ""
      }))
    }
  }, [searchTerm])



  

  useEffect(()=>{
    const getUsers = async () => {
      try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        
        const res = await fetch(`${API_BASE_URL}${USER_API.FILTER_USER}?search=faculty`, {
          method: "GET",
          headers: {
            "Content-type": 'application/json',
            "Authorization": `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if(res.status ===401){
          logout()
        }

        if (!res.ok) {
          throw new Error(data.detail || "Something went wrong")
        }

        setUsers(data.data)
      } catch (error: any) {
        console.error(error.message)
      }
    }

    getUsers()
  },[])

  useEffect(() => {

    if (mode === "add") {
      setForm({
        name: "",
        head_id: ""
      })
      return
    }

    if (mode === "edit" && data && users.length > 0) {
      const user = users.find((u) => u.id === data.head_id)

      setForm({
        name: data.name,
        head_id: data.head_id
      })
      setSearchTerm(user?.name??"")
    }

  }, [mode, data, users])


  const handleClose = () => {
    setOpen(false)
    setForm({ name: "", head_id: "" })
  }


  const handleSubmit = async () => {

    if (!form.name) return


    const { name, head_id } = form;


    if (mode === "add") {

      try {
        setLoading(true)
        const token = localStorage.getItem(StorageKey.TOKEN);
       
        const res = await fetch(`${API_BASE_URL}${DEPT_API.CREATE}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name, head_id }),
        });

        const data = await res.json();

        if(res.status ===401){
          logout()
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
        console.error("Create Department Error:", error);
        setError(error.message || "Failed to create department");

      }
      setLoading(false)
      setForm({
        "name": "",
        "head_id": ""
      })
      setSearchTerm("")
    }



    if (mode === 'edit' && data) {

      try {
        setLoading(true)
        

        const {name,head_id} = form
        const token = localStorage.getItem(StorageKey.TOKEN)

        if (!token) {
          console.error("Token missing")
          return
        }

        const res = await fetch(
          `${API_BASE_URL}${DEPT_API.UPDATE}/${data.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name, head_id }),
          }
        )

        const body = await res.json()

        if (res.status === 401) {
          console.log("Unauthorized")
          logout()
          return
        }

        if (!res.ok) {
          console.error(body.message || "Update failed")
          return
        }

        // console.log({"Message" : body.message})

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
            {isEdit ? "Edit Department" : "Add Department"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update department details."
              : "Create a new academic department."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
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
            <SearchSelect
            onChange={setSearchTerm}
            onSelect={(u)=>{
              setSearchTerm(u.name)
              setForm((prev) => ({
                ...prev,
                head_id: u.id
              }))
            }}
            setShowOverlay={setShowOverlay}
            showOverlay={showOverlay}
            users={filterUser}
            placeHolder="Search head of department"
            hideCard={true}
            value={searchTerm}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!form.name}
          >
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





