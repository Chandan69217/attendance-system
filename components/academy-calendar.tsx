"use client"

import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const year = 2026

export const academyHolidays2026 = [
    { date: "2026-01-01", title: "New Year" },
    { date: "2026-01-26", title: "Republic Day" },
    { date: "2026-03-25", title: "Holi" },
    { date: "2026-08-15", title: "Independence Day" },
    { date: "2026-10-02", title: "Gandhi Jayanti" },
    { date: "2026-12-25", title: "Christmas" },
]


const holidays = academyHolidays2026.map(
    (h) => new Date(h.date)
)

export function AcademyCalendar() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Academic Calendar {year}</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                }}
                            />

                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
