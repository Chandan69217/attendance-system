import { API_BASE_URL, ASSIGNMENT_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"

export const createAssignment = async (assignment: any) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${ASSIGNMENT_API.CREATE}`

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(assignment)
        })

        if (res.status === 401) {
            return false;
        }

        const data = await res.json()

        if (!res.ok) throw new Error(`Status Code:-${res.status}, ${data?.message ?? "Something went wrong !"}`)

        return data;

    } catch (error: any) {
        console.error(error.message)
    }
}

export const getAssignments = async () => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${ASSIGNMENT_API.GET}`

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        if (res.status === 401) {
            return []
        }

        const data = await res.json()

        if (!res.ok) throw new Error(`Status Code:-${res.status}, ${data?.message ?? "Something went wrong !"}`)

        const status = data.status ?? false
        if (status) {
            return data.data ?? []
        }

    } catch (error: any) {
        console.error(error.message)
        return []
    }
}
