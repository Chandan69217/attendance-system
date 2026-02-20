"use client"

import React, { useEffect } from "react"
import { useState } from "react"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users, XCircle, Clock,
  CheckCircle2,
} from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { FacultyAttendance } from "@/lib/types"
import { getFacultyAttendance, verifyFacultyAttendance } from "@/service/faculty-attendance.service"
import { CircularLoader } from "@/components/ui/circular-loader"




export function FacultyAttendanceVerification() {
  const { addToast } = useAppState()
  const [facultyAttendance, setFacultyAttendance] = useState<FacultyAttendance[]>([])
  const today = new Date().toLocaleDateString("en-CA");
  const [dateFilter, setDateFilter] = useState(today);
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isVerifyLoading, setVerifyIsLoading] = useState(false)
  const filteredRecords = facultyAttendance.filter((r) => {

    const matchesDate = r.date === dateFilter
    const matchesStatus = statusFilter === "all" || r.verification_status === statusFilter
    return matchesDate && matchesStatus
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex)



  useEffect(() => {
    const load = async () => {
      setFacultyAttendance(await getFacultyAttendance())
      setIsLoading(false)
    }
    load()
  }, [])

  const handleVerify = async (id: string, status: "approved" | "rejected") => {
    setVerifyIsLoading(true)
    const record = await verifyFacultyAttendance(id, status)
    if (record) {
      
      setFacultyAttendance((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...record } : item
        )
      )
      addToast({
        title: status === "approved" ? "Attendance Approved" : "Attendance Rejected",
        description: `${record?.faculty_name}'s attendance has been ${status}.`,
        variant: status === "approved" ? "success" : "destructive",
      })
    }
    setVerifyIsLoading(false)
  }

  const handleBulkApprove = async () => {
    setVerifyIsLoading(true)

    const pendingIds = filteredRecords
      .filter((r) => r.verification_status === "pending")
      .map((r) => r.id)

    const results = await Promise.all(
      pendingIds.map((id) =>
        verifyFacultyAttendance(id, "approved")
      )
    )

    const updatedRecords = results.filter(Boolean)

    setFacultyAttendance((prev) =>
      prev.map((item) => {
        const updated = updatedRecords.find((r) => r!.id === item.id)
        return updated ? { ...item, ...updated } : item
      })
    )

    addToast({
      title: "Bulk Approved",
      description: `${updatedRecords.length} records approved.`,
      variant: "success"
    })

    setVerifyIsLoading(false)
  }


  const pendingCount = facultyAttendance.filter((r) => r.verification_status === "pending").length
  const approvedCount = filteredRecords.filter((r) => r.verification_status === "approved").length
  const totalToday = filteredRecords.length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Faculty Attendance Verification</h3>
        <p className="text-sm text-muted-foreground">Review and approve/reject faculty attendance records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pending Review", value: pendingCount, icon: Clock, cls: "text-chart-3" },
          { label: "Approved Today", value: approvedCount, icon: CheckCircle2, cls: "text-primary" },
          { label: "Total Faculty Today", value: totalToday, icon: Users, cls: "text-accent" },
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {filteredRecords.some((r) => r.verification_status === "pending") && (
              <Button disabled = {isVerifyLoading} onClick={handleBulkApprove} size="sm" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />Approve All Pending
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex justify-center">
                        <CircularLoader />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (

                  paginatedRecords.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No records found</TableCell></TableRow>
                  ) : paginatedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{record.faculty_name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{record.faculty_name}</p>
                            <p className="text-xs text-muted-foreground">{record.faculty_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.check_in || "---"}</TableCell>
                      <TableCell className="text-sm">{record.check_out || "---"}</TableCell>
                      <TableCell>
                        <Badge className={record.status === "present" ? "bg-primary/15 text-primary border-primary/20" : record.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : record.status === "on-leave" ? "bg-accent/15 text-accent border-accent/20" : "bg-destructive/15 text-destructive"}>
                          {record.status === "on-leave" ? "On Leave" : record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.remarks ?? "---"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={record.verification_status === "approved" ? "bg-primary/15 text-primary border-primary/20" : record.verification_status === "rejected" ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-chart-3/15 text-chart-3 border-chart-3/20"}>
                          {record.verification_status.charAt(0).toUpperCase() + record.verification_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.verification_status === "pending" ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button disabled = {isVerifyLoading}size="sm" variant="ghost" className="h-8 gap-1 text-primary hover:text-primary" onClick={() => handleVerify(record.id, "approved")}>
                              <CheckCircle2 className="h-4 w-4" />Approve
                            </Button>
                            <Button disabled ={isVerifyLoading}size="sm" variant="ghost" className="h-8 gap-1 text-destructive hover:text-destructive" onClick={() => handleVerify(record.id, "rejected")}>
                              <XCircle className="h-4 w-4" />Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Verified</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))

                )
              }
            </TableBody>
          </Table>
          {
            (paginatedRecords.length > 0 && !isLoading) &&
            <Pagination className="my-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
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
                      setCurrentPage((next) => Math.min(next + 1, totalPages))
                    }}
                    className={currentPage === totalPages || currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          }
        </CardContent>
      </Card>
    </div>
  )
}