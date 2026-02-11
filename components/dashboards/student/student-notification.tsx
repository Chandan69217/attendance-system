import { useAppState } from "@/lib/app-state"
import { Card, CardContent, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
 FileText, Bell, BookOpen,CheckCircle2,
} from "lucide-react"



export function StudentNotifications() {
  const { notifications, setNotifications, addToast } = useAppState()

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    addToast({ title: "All Read", description: "All notifications marked as read.", variant: "default" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Notifications</h3><p className="text-sm text-muted-foreground">Stay updated with announcements and alerts</p></div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="bg-transparent">Mark All Read</Button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`cursor-pointer transition-colors ${!notif.read ? "border-primary/20 bg-primary/[0.02]" : ""}`}
            onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notif.category === "exam" ? "bg-accent/10" : notif.category === "assignment" ? "bg-chart-3/10" : notif.category === "attendance" ? "bg-primary/10" : "bg-primary/10"}`}>
                {notif.category === "exam" ? <BookOpen className="h-5 w-5 text-accent" />
                : notif.category === "assignment" ? <FileText className="h-5 w-5 text-chart-3" />
                : notif.category === "attendance" ? <CheckCircle2 className="h-5 w-5 text-primary" />
                : <Bell className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${!notif.read ? "font-semibold" : ""} text-card-foreground`}>{notif.title}</p>
                  {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notif.message}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{new Date(notif.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
