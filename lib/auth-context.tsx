"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, Role } from "./types"
import { mockUsers } from "./mock-data"
import { API_BASE_URL, AUTH_API } from "./config"
import { StorageKey } from "./constants"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: Role) => Promise<LoginResponse>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

interface LoginResponse {
  status: boolean
  message: string
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem(StorageKey.USER)
    const token = localStorage.getItem(StorageKey.TOKEN)

    if (!storedUser || !token) return

    if (storedUser === "null" || token === "null") return

    const user_json = JSON.parse(storedUser)

    if (!user_json?.id) return

    setUser({
      id: user_json.id,
      name: user_json.name,
      email: user_json.email,
      avatar: user_json.avatar,
      joinDate: user_json.join_date,
      phone: user_json.phone,
      status: user_json.status,
      role: user_json.role,
      department: user_json.department,
      class: user_json.class_name,
    })

    setIsAuthenticated(true)
  }, [])


  const login = async (
    email: string,
    password: string,
    role: Role
  ): Promise<LoginResponse> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }),
        }
      )

      const data = await res.json()


      if (!res.ok) {
        return {
          status: false,
          message: data.detail || "Login failed",
        }
      }

      const status = data.status
      const message = data.message


      if(!status){
        return {
          "status": status,
          "message": message
        }
      }

      const userData: User = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        avatar:data.data.avatar,
        joinDate:data.data.join_date,
        phone:data.data.phone,
        status:data.data.status,
        role: data.data.role,
        department: data.data.department,
        class: data.data.class_name,
      }

      localStorage.setItem(StorageKey.TOKEN, data.token)
      localStorage.setItem(StorageKey.USER, JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      return {
        status: true,
        message: data.message || "Login successful",
      }

    } catch (error: any) {
      console.log(error)
      return {
        status: false,
        message: error?.message || "Network error",
      }
    }
  }

  




  const logout = () => {
    localStorage.removeItem(StorageKey.TOKEN)
    localStorage.removeItem(StorageKey.USER)

    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated}}>
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
