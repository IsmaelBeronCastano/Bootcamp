import { Movement } from "./domain/movement"

export interface MovementRepository{
    all: ()=> Promise<Movement[]>
    find: (id: number)=> Promise<Movement | null>
    store: (entry: Movement)=> Promise<void>

}