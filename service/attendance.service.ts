import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL, ATTENDANCE_API } from "@/lib/config";
import { AttendanceRecord, FacultyAttendance, SubjectAttendance } from "@/lib/types";



interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}


export const getFacultyAttendance = async (
    faculty_id?: string,
    date?: string
): Promise<FacultyAttendance[]> => {
    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();

        if (faculty_id) params.append("faculty_id", faculty_id);
        if (date) params.append("date", date);

        const response = await fetch(
            `${API_BASE_URL}${ATTENDANCE_API.FACULTY_ATTENDANCE}?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result: ApiResponse<FacultyAttendance[]> =
            await response.json();

        if (!result.status) {
            throw new Error(result.message);
        }

        return result.data;
    } catch (error: any) {
        console.error("Faculty attendance fetch error:", error);
        throw error;
    }
};


export const getStudentAttendance = async (
    student_id?: string,
    date?: string
): Promise<AttendanceRecord[]> => {
    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();

        if (student_id) params.append("student_id", student_id);
        if (date) params.append("date", date);

        const response = await fetch(
            `${API_BASE_URL}${ATTENDANCE_API.STUDENT_ATTENDANCE}?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result: ApiResponse<AttendanceRecord[]> =
            await response.json();

        if (!result.status) {
            throw new Error(result.message);
        }

        return result.data;
    } catch (error: any) {
        console.error("Student attendance fetch error:", error);
        throw error;
    }
};


export const getAttendanceBySubject = async (): Promise<SubjectAttendance[]> => {
    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();

        const response = await fetch(
            `${API_BASE_URL}${ATTENDANCE_API.SUBJECT_ATTENDANCE}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result: ApiResponse<SubjectAttendance[]> =
            await response.json();

        if (!result.status) {
            throw new Error(result.message);
        }

        return result.data;
    } catch (error: any) {
        console.error("Subject attendance fetch error:", error);
        throw error;
    }
};

export const verifyFacultyAttendance = async (
    id: string,
    status: "pending" | "approved" | "rejected"
): Promise<FacultyAttendance|null> => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_BASE_URL}${ATTENDANCE_API.VERIFY_ATTENDANCE}/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: status,
                }),
            },
        );

        if(response.status === 401){
            useAuth().logout()
            throw new Error("Unauthorized Access")
        }

        if(!response.ok){
           console.log("Response code:",response.status,"error message",response.body )
           return null
        }

        const data = await response.json()

        if (data.status){
            return data.data
        }
        return null
    } catch (error: any) {
        console.error("Faculty attendance verification error:", error);
        throw error;
    }
}




export const getClassAttendance = async (
    date?: string
): Promise<AttendanceRecord[]> => {
    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();

        if (date) params.append("date", date);

        const response = await fetch(
            `${API_BASE_URL}${ATTENDANCE_API.CLASS_ATTENDANCE}?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result: ApiResponse<AttendanceRecord[]> =
            await response.json();

        if (!result.status) {
            throw new Error(result.message);
        }

        return result.data;
    } catch (error: any) {
        console.error("Class attendance fetch error:", error);
        throw error;
    }
};
