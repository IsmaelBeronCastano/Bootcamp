import {create} from 'zustand'

interface AuthState{
    status: 'authenticated' | 'unauthenticated' | 'checking'
    token?: string
    user?:{
        name: string
        email: string
    }
    login : (email: string,password: string) => void 
    logout: ()=> void
}

export const useAuthStore = create<AuthState>()((set)=>({
    status: 'checking',
    token: undefined,
    user: undefined,
    login: (email: string,password: string) => {
        set({
            status: 'authenticated',
            token: 'abc123',
            user:{
                name: 'John Doe',
                email: 'john@example.com'
            }
        })
    },
    logout: ()=>{
        set({
            status: 'unauthenticated',
            token: undefined,
            user: undefined
        })
    }

}))