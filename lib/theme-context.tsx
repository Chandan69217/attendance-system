"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  // const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // setMounted(true)
    const stored = window.localStorage.getItem("attendai-theme") as Theme | null
    if (stored === "dark" || stored === "light") {
      setThemeState(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    window.localStorage.setItem("attendai-theme", t)
    document.documentElement.classList.toggle("dark", t === "dark")
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
  
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
