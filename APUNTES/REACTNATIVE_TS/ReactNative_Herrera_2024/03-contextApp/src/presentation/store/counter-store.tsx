import { create } from "zustand"


interface CounterState{
    count: number
    increment: (value: number)=> void
}

export const useCounterStore = create<CounterState>()((set,get)=>({

    count: 1,
    increment: (value)=>{set(state=> ({count:state.count + value}))},
}))