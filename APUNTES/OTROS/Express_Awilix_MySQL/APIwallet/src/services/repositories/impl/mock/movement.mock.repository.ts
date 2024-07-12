import {db} from '../../../../common/persistence/mock.persistence'
import { Movement } from "../../domain/movement";
import { MovementRepository } from "../../movement.repository";


export class MovementMockRepository implements MovementRepository{

    async all(): Promise<Movement[]>{
      const table = db.movement as Movement[] 
      return Object.assign({...table})   
    }
    
    
    async find(id: number): Promise<Movement | null>{

        const table = db.movement as Movement[]
        const result = table.find(x=> x.id === id)
        if(result){
            //uso el spread para romper la referencia del objeto así no mutaría el original
            return Object.assign({...result})
        }else{
            return null
        }
     
    }

    async store(entry: Movement): Promise<void>{
       const table = db.movement as Movement[]
       const now = new Date()

       //estamos haciendo una inserción, esto representa el autoincrement
       db.movement_id++

       
       table.push({
        id: db.movement_id, //ene ste caso el id si hay que pasarlo manualmente
        type: entry.type,
        amount: entry.amount,
        user_id: entry.user_id,
        created_at: now,
        updated_at: null
       } as Movement)
    }
}