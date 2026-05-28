import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, DEPT_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"



export const getDepartments = async (params?: {
    id?: string
}) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)


        let url = `${API_BASE_URL}${DEPT_API.GET_DEPT}`

        const query = new URLSearchParams()

        if (params?.id) query.append("id", params.id)

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