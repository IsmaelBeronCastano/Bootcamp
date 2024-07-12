import { Balance } from "./domain/balance"


export interface BalanceRepository{
    all: ()=> Promise<Balance[]>
    find: (id: number)=> Promise<Balance | null>
    findByUserAndCode: (id: number)=> Promise<Balance | null>
    store: (entry: Balance)=> Promise<void>
    update: (entry: Balance)=> Promise<void>
    remove: (id: number)=>Promise<void>
}