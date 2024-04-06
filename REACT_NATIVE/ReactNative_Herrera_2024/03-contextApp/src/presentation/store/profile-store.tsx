import { create } from "zustand"


interface ProfileState{
    name: string
    email: string
    changeProfile: (name: string, email: string)=> void
}

export const useProfileStore = create<ProfileState>()((set, get)=>({
    name: 'Bill Murray',
    email: "billybilly@gmail.com",

    changeProfile: (name: string, email: string)=>{
        set({name, email})
    }
}))