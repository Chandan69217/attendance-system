import { API_BASE_URL, EXAM_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Exam } from "@/lib/types"

export const createExam = async (exam: any) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${EXAM_API.CREATE}`

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(exam)
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

export const getExams = async () => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${EXAM_API.GET}`

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
