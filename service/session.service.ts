import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, SESSION_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"



export const getSessions = async (params?: {
    id?: string,
    status?: "active" | "upcoming" | "completed"
}) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)


        let url = `${API_BASE_URL}${SESSION_API.GET}`

        const query = new URLSearchParams()

        if (params?.id) query.append("id", params.id)

        if (params?.status) query.append("status",params.status)

        if (query.toString()) {
           url =  url + `?${query.toString()}`
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })

        const data = await res.json()

        if (res.status === 401) {
            useAuth().logout()
        }

        if (!res.ok) {
            throw new Error(data.detail || "Something went wrong")
        }

        return data.data

    } catch (error: any) {
        console.error(error.message)
    }

}
