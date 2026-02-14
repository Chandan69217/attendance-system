import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL, AUTH_API, USER_API } from "@/lib/config"
import { StorageKey } from "@/lib/constants"
import { Role, UserUpdatePayload } from "@/lib/types"
import { error } from "console"



 export const getFilterUsers = async (params?:{
    search?:string
 }) => {
      try {
        const token = localStorage.getItem(StorageKey.TOKEN)
    
          let url = `${API_BASE_URL}${USER_API.FILTER_USER}`

          const query = new URLSearchParams()

          if(params?.search) query.append("search",params.search)
        
        if(query.toString()){
           url =  url + `?${query.toString()}`
        }
    
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-type": 'application/json',
            "Authorization": `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if(res.status ===401){
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


export const registerUser = async (params:{
  name:string,
  email:string,
  role: Role,
  dept_id?:string,
  class_id?:string,
  avatar?:string,
  phone?:string,
  status?:string
})=>{
  try{

    const token = localStorage.getItem(StorageKey.TOKEN)

    let url = `${API_BASE_URL}${AUTH_API.REGISTER}`

    const res  = await fetch(url,{
      method:"POST",
      headers: {
        'Content-type':'application/json',
        "Authorization" : `Bearer ${token}`
      },
      body: JSON.stringify(params)
    })

    if(res.status === 401){
      useAuth().logout()
    }

    if(!res.ok) throw new Error(`Faild status:${res.status} error:${res.body}`)

    const data = await res.json()

    const status = data.status

    if(status){
      return true
    }


  }catch(error:any){
    console.error({"Error" : error.message||"Something went wrong"})
  }
  return false
}


export const deleteUser = async (id:string)=>{
  try{
    const token = localStorage.getItem(StorageKey.TOKEN)

    const res = await fetch(`${API_BASE_URL}${USER_API.DELETE_USER}/${id}`,{
      method:"DELETE",
      headers:{
        "Content-type": "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })
    
    if(res.status === 401){
      useAuth().logout()
    }

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Something went wrong")

    if(data.status)
      return data.data
    
  }catch(error:any){
    throw new Error(error.message)
  }

}




export const updateUser = async (
  id: string,
  params: UserUpdatePayload,
) => {
  try {
    const token = localStorage.getItem(StorageKey.TOKEN)

    const res = await fetch(
      `${API_BASE_URL}${USER_API.UPDATE_USER}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      }
    )

    if (res.status === 401) {
      useAuth().logout()
      throw new Error("Unauthorized")
    }

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data

  } catch (error: any) {
    throw new Error(error.message)
  }
  
}
