import axios from 'axios'


export const usersApi = axios.create({
    baseURL: 'http://localhost:3004/users'
})



 export  const getAllUsers = async()=>{
    
        const {data} = await usersApi.get('/all')

        return data
}