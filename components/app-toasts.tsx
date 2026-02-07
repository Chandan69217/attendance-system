"use client"

import { useAppState } from "@/lib/app-state"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"

export function AppToasts() {
  const { toasts, removeToast } = useAppState()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-bottom-2 ${
            toast.variant === "success"
              ? "border-primary/30 bg-primary/10 text-foreground"
              : toast.variant === "destructive"
                ? "border-destructive/30 bg-destructive/10 text-foreground"
                : "border-border bg-card text-card-foreground"
          }`}
          style={{ minWidth: 300, maxWidth: 420 }}
        >
          {toast.variant === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          ) : toast.variant === "destructive" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          ) : (
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      ))}
    </div>
  )
}
