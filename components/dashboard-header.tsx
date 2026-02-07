"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useAppState } from "@/lib/app-state"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Bell, Moon, Sun } from "lucide-react"

export function DashboardHeader({ title }: { title: string }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications } = useAppState()
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h2 className="flex-1 text-sm font-semibold text-card-foreground">{title}</h2>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setNotifOpen(true)}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
        <span className="hidden text-sm text-muted-foreground md:inline ml-2">{user?.name}</span>
      </div>
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  )
}
