import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppState } from "@/lib/app-state"


export function StudentExams() {
    const { exams } = useAppState()
    return (
        <div className="flex flex-col gap-6">
            <div><h3 className="text-lg font-semibold text-foreground">Exam Schedule</h3><p className="text-sm text-muted-foreground">Upcoming examination timetable</p></div>
            <div className="grid gap-4 md:grid-cols-2">
                {exams.map((exam) => {
                    const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date("2026-02-06").getTime()) / (1000 * 60 * 60 * 24))
                    return (
                        <Card key={exam.id}>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10">
                                    <span className="text-xs font-medium text-primary">{new Date(exam.date).toLocaleDateString("en-US", { month: "short" })}</span>
                                    <span className="text-lg font-bold text-primary">{new Date(exam.date).getDate()}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-card-foreground">{exam.subject}</p>
                                    <p className="text-sm text-muted-foreground">{exam.time} - {exam.venue}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Badge variant="secondary">{exam.type}</Badge>
                                        <span className="text-xs text-muted-foreground">{daysLeft > 0 ? `${daysLeft} days left` : "Today"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}