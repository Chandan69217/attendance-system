"use client"

import React, { useEffect, useMemo } from "react"
import { useState } from "react"
import { Role, User } from "@/lib/types"
import { useAppState } from "@/lib/app-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { weeklyAttendanceData, monthlyAttendanceData } from "@/lib/mock-data"
import {
    Users, ClipboardList, GraduationCap, TrendingUp, TrendingDown, Clock,
    Search,
    RotateCcw,
    Download,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getMonthlyAttendanceChartData, getWeeklyAttendanceChartData } from "@/lib/utils"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Label } from "@/components/ui/label"



export function StudentAttendanceRecord() {

    const { users, attendance, } = useAppState()
    const [searchTerm, setSearchTerm] = useState('')
    const [showOverlay, setShowOverlay] = useState(false)
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [currentPage, setCurrentPage] = useState(1)
    const [fromDate, setFromDate] = useState<string>("")
    const [toDate, setToDate] = useState<string>("")



    const filteredUsers = users.filter((u) => ((u.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
        (u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
        (u.id === searchTerm.trim().toLowerCase())) && (u.role === "student")
    )


    const filterAttendance = attendance.filter((a) => {
        if (selectedUser && a.studentId !== selectedUser.id) return false

        if (fromDate && a.date < fromDate) return false
        if (toDate && a.date > toDate) return false

        return true
    })


    const itemsPerPage = 7
    const totalPages = Math.ceil(filterAttendance.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedAttendance = filterAttendance.slice(startIndex, endIndex)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowOverlay(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const weeklyAttendanceData = useMemo(() => {
        const today = new Date()
        const dayStr = today.toISOString().split("T")[0]

        return getWeeklyAttendanceChartData(filterAttendance, dayStr)
    }, [filterAttendance])

    const monthlyAttendanceData = useMemo(() => {
        const today = new Date()

        return getMonthlyAttendanceChartData(filterAttendance, today.getFullYear())
    }, [filterAttendance])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSelectedUser(undefined)
        }
    }, [searchTerm])


    const handleReset = () => {
        setSearchTerm("")
        setSelectedUser(undefined)
        setFromDate("")
        setToDate("")
        setCurrentPage(1)
        setShowOverlay(false)
    }



    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Student Attendance</h3>
                    <p className="text-sm text-muted-foreground">Student Attendance summary and statistics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset} className=" gap-2 bg-transparent
                        text-red-600
                        hover:bg-red-50
                        hover:text-red-600
                        hover:border-red-100"
                    ><RotateCcw className="h-4 w-4 text-red-600" />Reset</Button>
                    <Button variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Export</Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div ref={wrapperRef} className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setShowOverlay(true)
                            }}
                            onFocus={() => setShowOverlay(true)}
                        />

                        {showOverlay && searchTerm.trim() && (
                            <div className="absolute top-full left-0 right-0 z-20 mt-2">
                                <Card className="shadow-md border">
                                    <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                                        {filteredUsers.length > 0 ? (
                                            <Table>
                                                <TableBody>
                                                    {filteredUsers.map((user) => (
                                                        <TableRow
                                                            key={user.id}
                                                            className="cursor-pointer hover:bg-muted"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setSearchTerm(user.name)
                                                                setShowOverlay(false)
                                                            }}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                                            {user.name
                                                                                .split(" ")
                                                                                .map((n) => n[0])
                                                                                .join("")}
                                                                        </AvatarFallback>
                                                                    </Avatar>

                                                                    <div>
                                                                        <p className="text-sm font-medium">{user.name}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {user.email}
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="py-6 text-center text-muted-foreground">
                                                No users found
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-base">Attendance Record</CardTitle>
                        <CardDescription>Recorded attendance entries</CardDescription>
                    </div>
                    <div className="flex justify-between gap-2">

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="from-date">Start Date</Label>
                            <Input
                                id="from-date"
                                type="date"
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-auto min-w-[160px]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="to-date">End Date</Label>
                            <Input
                                id="to-date"
                                type="date"
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-auto min-w-[160px]"
                            />
                        </div>



                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedAttendance.length === 0 &&
                                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No record found</TableCell></TableRow>
                            }
                            {paginatedAttendance.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium text-foreground">{r.studentName}</TableCell>
                                    <TableCell>{r.subject}</TableCell>
                                    <TableCell>{r.date}</TableCell>
                                    <TableCell><Badge variant="secondary" className="text-xs capitalize">{r.method?.replace("-", " ") ?? "manual"}</Badge></TableCell>
                                    <TableCell>
                                        <Badge className={r.status === "present" ? "bg-primary/15 text-primary border-primary/20" : r.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {paginatedAttendance.length > 0 && <Pagination className="my-4">
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

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Weekly Attendance</CardTitle>
                        <CardDescription>Present vs absent students this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyAttendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                                    <Legend />
                                    <Bar dataKey="present" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Present" />
                                    <Bar dataKey="absent" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Absent" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Monthly Attendance Trend</CardTitle>
                        <CardDescription>Average attendance percentage per month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyAttendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                    <YAxis domain={[70, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
                                    <Line type="monotone" dataKey="percentage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))" }} name="Attendance %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent Attendance</CardTitle>
                    <CardDescription>Last recorded attendance entries</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterAttendance.length === 0 &&
                                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No record found</TableCell></TableRow>
                            }
                            {filterAttendance.slice(0, 6).map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium text-foreground">{r.studentName}</TableCell>
                                    <TableCell>{r.subject}</TableCell>
                                    <TableCell>{r.date}</TableCell>
                                    <TableCell><Badge variant="secondary" className="text-xs capitalize">{r.method?.replace("-", " ") ?? "manual"}</Badge></TableCell>
                                    <TableCell>
                                        <Badge className={r.status === "present" ? "bg-primary/15 text-primary border-primary/20" : r.status === "late" ? "bg-chart-3/15 text-chart-3 border-chart-3/20" : "bg-destructive/15 text-destructive border-destructive/20"}>
                                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}