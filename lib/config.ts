

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL


export const AUTH_API = {
    "SEND_OTP": process.env.NEXT_PUBLIC_SEND_OTP,
    "VERIFY_OTP": process.env.NEXT_PUBLIC_VERIFY_OTP,
    "CHANGE_PASSWORD": process.env.NEXT_PUBLIC_CHANGE_PASSWORD,
    "LOGIN": process.env.NEXT_PUBLIC_LOGIN,
    "REGISTER": process.env.NEXT_PUBLIC_REGISTER 
}

export const DEPT_API = {
    "CREATE": process.env.NEXT_PUBLIC_CREATE_DEPARTMENT,
    "GET_DEPT": process.env.NEXT_PUBLIC_GET_DEPARTMENT,
    "DELETE": process.env.NEXT_PUBLIC_DELETE_DEPARTMENT,
    "UPDATE": process.env.NEXT_PUBLIC_UPDATE_DEPARTMENT,
}

export const USER_API ={
    "FILTER_USER": process.env.NEXT_PUBLIC_GET_FILTER_USER
}