"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, Role } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: Role) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, _password: string, role: Role): boolean => {
    const found = mockUsers.find((u) => u.email === email && u.role === role)
    if (found) {
      setUser(found)
      return true
    }
    // Demo: allow any login by creating a user with the role
    const demoUser: User = {
      id: `DEMO-${Date.now()}`,
      name: role === "admin" ? "Admin User" : role === "faculty" ? "Faculty User" : "Student User",
      email,
      role,
      department: "Computer Science",
      class: role === "student" ? "CS-301" : undefined,
    }
    setUser(demoUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
