import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL, LECTURE_API } from "@/lib/config";
import { Lecture } from "@/lib/types";




export const getLecture = async (
    query?: { lecture_id?: string,  faculty_id?: string, class_id?:string,student_id?: string }
): Promise<Lecture[]> => {

    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();

        if (query?.faculty_id) params.append("faculty_id", query.faculty_id);
        if (query?.lecture_id) params.append("lecture_id", query.lecture_id);
        if (query?.student_id) params.append("student_id", query.student_id);

        const url = `${API_BASE_URL}${LECTURE_API.GET_TODAY_LECTURE}${params.toString() ? `?${params.toString()}` : ""
            }`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (!response.ok) {
            console.error("API error:", response.status);
            return []; 
        }

        const result = await response.json();

        if (!result.status) {
            console.error("Backend error:", result.message);
            return []; 
        }

        return Array.isArray(result.data) ? result.data : [result.data];

    } catch (error: any) {
        console.error("Lecture fetch error:", error);
        return []; 
    }
};



export const startLecture = async (): Promise<Lecture|null> => {

    try {
        const token = localStorage.getItem("token");

        const url = `${API_BASE_URL}${LECTURE_API.START_CREATE_LECTURE}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (!response.ok) {
            console.error("API error:", response.status);
            return null;
        }

        const result = await response.json();

        if (!result.status) {
            console.error("Backend error:", result.message);
            return null;
        }

        return Array.isArray(result.data) ? result.data : result.data;

    } catch (error: any) {
        console.error("Lecture fetch error:", error);
        return null;
    }
}



export const endLecture = async (lecture_id:string): Promise<boolean> => {

    try {
        const token = localStorage.getItem("token");

        const url = `${API_BASE_URL}${LECTURE_API.END_LECTURE}/${lecture_id}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (!response.ok) {
            console.error("API error:", response.status);
            return false;
        }

        const result = await response.json();

        if (!result.status) {
            console.error("Backend error:", result.message);
            return false;
        }

        return true;

    } catch (error: any) {
        console.error("Lecture fetch error:", error);
        return false;
    }
}