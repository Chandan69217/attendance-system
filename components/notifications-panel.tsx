"use client"

import { useAppState } from "@/lib/app-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, BookOpen, FileText, Megaphone, CheckCircle2, X } from "lucide-react"

const categoryIcons: Record<string, typeof BookOpen> = {
  exam: BookOpen,
  assignment: FileText,
  announcement: Megaphone,
  attendance: CheckCircle2,
}

const categoryColors: Record<string, string> = {
  exam: "bg-accent/10 text-accent",
  assignment: "bg-chart-3/10 text-chart-3",
  announcement: "bg-primary/10 text-primary",
  attendance: "bg-primary/10 text-primary",
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, setNotifications } = useAppState()
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16">
      <div className="absolute inset-0 bg-foreground/5 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-card-foreground" />
            <h3 className="font-semibold text-card-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="max-h-96">
          <div className="flex flex-col">
            {notifications.map((notification) => {
              const Icon = categoryIcons[notification.category] ?? Bell
              return (
                <button
                  key={notification.id}
                  type="button"
                  className={`flex items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted ${
                    !notification.read ? "bg-primary/[0.03]" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${categoryColors[notification.category] ?? "bg-primary/10 text-primary"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!notification.read ? "font-semibold text-card-foreground" : "text-card-foreground"}`}>
                        {notification.title}
                      </p>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {new Date(notification.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
