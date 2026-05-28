import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, CLASS_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Class } from "@/lib/types"
import { use } from "react"


export const getClasses = async (params?: {
    id?: string
    dept_id?: string
}) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)

        if (!token) throw new Error("Unauthorized")

        let url = `${API_BASE_URL}${CLASS_API.GET}`

        const query = new URLSearchParams()

        if (params?.id) query.append("id", params.id)
        if (params?.dept_id) query.append("dept_id", params.dept_id)

        if (query.toString()) {
            url += `?${query.toString()}`
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await res.json()

        if(res.status === 401){
            useAuth().logout()
        }
        
        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch classes")
        }

        return data.data

    } catch (error: any) {
        console.log(error.message)
    }
}


export const getFacultyClass = async (): Promise<Class[]> => {
    try {
        const token = localStorage.getItem("token");

        let url = `${API_BASE_URL}${CLASS_API.FACULTY_CLASS}`

        const response = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (!response.ok) {
            console.error("Failed to fetch faculty class");
            return [];   
        }

        const data = await response.json();

        if (data.status && data.data) {
            return Array.isArray(data.data)
                ? data.data
                : [data.data]; 
        }
        return [];
    } catch (error) {
        console.error("Get faculty class error:", error);
        return []; 
    }
};




export const deleteClass = async (id: string) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)

        console.log(`${API_BASE_URL}${CLASS_API.DELETE}/${id}`)
        const res = await fetch(`${API_BASE_URL}${CLASS_API.DELETE}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await res.json()

        if( res.status === 401){
            useAuth().logout()
            return false;
        }
        if (!res.ok) {
            throw new Error(data.message || "Failed to delete class")
        }
       
        const status = data['status']??false
        return status

    } catch (error: any) {
        console.log(error.message)
    }
    return false
}
