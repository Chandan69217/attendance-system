
import { API_BASE_URL, NOTIFICATION_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Notification } from "@/lib/types"





export const createNotification = async (notification: Notification) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${NOTIFICATION_API.CREATE_NOTIFICATION}`

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(notification)
        })

        if (res.status === 401) {
            return false;
        }

        const data = await res.json()

        if (!res.ok) throw new Error(`Status Code:-${res.status}, ${data?.message ?? "Something went wrong !"}`)

        return true;

    } catch (error: any) {
        console.error(error.message)
    }
}

export const deleteNotification = async (id: string) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${NOTIFICATION_API.DELETE_NOTIFICATION}/${id}`

        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        if (res.status === 401) {
            return false;
        }

        const data = await res.json()

        if (!res.ok) throw new Error(`Status Code:-${res.status}, ${data?.message ?? "Something went wrong !"}`)

        const status = data.status ?? false
        if (status) {
            return status
        } else {
            return false
        }

    } catch (error: any) {
        console.error(error.message)
    }
}

export const markAsReadNotification = async (id: string) => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${NOTIFICATION_API.MARK_AS_READ}/${id}`

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({})
        })

        if (res.status === 401) {
            return false;
        }

        const data = await res.json()

        if (!res.ok) throw new Error(`Status Code:-${res.status}, ${data?.message ?? "Something went wrong !"}`)

        console.log(data)
        const status = data.status ?? false
        if (status) {
            return status
        } else {
            return false
        }

    } catch (error: any) {
        console.error(error.message)
    }
}


export const getNotifications = async () => {
    try {
        const token = localStorage.getItem(StorageKey.TOKEN)
        const url = `${API_BASE_URL}${NOTIFICATION_API.GET_NOTIFICATION}`

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