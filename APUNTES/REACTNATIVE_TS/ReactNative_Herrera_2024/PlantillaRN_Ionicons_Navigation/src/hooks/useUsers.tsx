import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ReqUserListResponse, User } from '../interfaces/DataAxios'
import axios from 'axios'

const loadUsers = async (page: number = 1): Promise<User[]>=>{
    try {
      const {data} = await axios.get<ReqUserListResponse>("https://reqres.in/api/users",{
        params:{
          page: page
        }
      }) 
      return data.data
      
    } catch (error) {
      console.log(error)
      return []
    }
  }
  
const useUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const currentPageRef = useRef(1)

  const nextPage = async () =>{
    currentPageRef.current ++;
    
    const users = await loadUsers(currentPageRef.current)
    if(users.length > 0){
      setUsers(users)
    }else{
      currentPageRef.current --;
    }
  }

  const previousPage = async () =>{
    if(currentPageRef.current < 1) return
      
    currentPageRef.current --;
    const users = await loadUsers(currentPageRef.current)
    setUsers(users)

  }

    useEffect(()=>{
     loadUsers(currentPageRef.current).then(setUsers)
    }, [])

    return {
        nextPage,
        previousPage,
        users
    }
}

export default useUsers