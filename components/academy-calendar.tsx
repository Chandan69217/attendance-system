"use client"

import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { StorageKey } from "@/lib/constants"
import { ACADEMIC_API, API_BASE_URL } from "@/lib/config"
import { useAuth } from "@/lib/auth-context"


export function AcademyCalendar() {

    const this_year = new Date().getFullYear()
    const [year,setYear] = useState(this_year)

    const [academicHolidays,setHolidays] = useState<string[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState("")

    const holidays = academicHolidays.map(
        (h) => new Date(h)
    )


    useEffect(()=>{
        const getAcademic = async ()=>{
            try{
                const token = localStorage.getItem(StorageKey.TOKEN)
                const res = await fetch(`${API_BASE_URL}${ACADEMIC_API.ACADEMIC}/`, {
                    method: "GET",
                    headers: {
                        "Content-type": 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (res.status === 401) {
                    useAuth().logout()
                    setError("UnAuthorized")
                }
                const data = await res.json()
                
                if (!res.ok) throw new Error(data.message || "Something went wrong")

                const status = data.status;
                const message = data.message;
                setError(message)
                if (status) {
                    setError("")
                    setYear(data.data.academic_year)
                    setHolidays(data.data.holidays)
                }
            }catch(error:any){
                console.log(error.message||"Something went wrong")
            }
        }
        getAcademic()
    },[])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Academic Calendar {year}</CardTitle>
            </CardHeader>

            <CardContent>
                <div
                    className="grid gap-6 justify-center
  [grid-template-columns:repeat(auto-fit,minmax(320px,max-content))]"
                >


                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-3 shadow-sm">
                            <DayPicker
                                month={new Date(year, i)}
                                showOutsideDays
                                fixedWeeks
                                modifiers={{
                                    holiday: holidays,
                                    sunday: { dayOfWeek: [0] },
                                }}
                                modifiersClassNames={{
                                    holiday:
                                        "bg-red-100 text-red-600 font-semibold rounded-md",
                                    sunday:
                                        "text-red-500 font-medium",
                                    today:
                                        "bg-blue-500 text-white font-bold rounded-md",
                                }}
                            />

                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
