import connector from '../../../../common/persistence/mssql.persistence'
import { Movement } from "../../domain/movement";
import { MovementRepository } from "../../movement.repository";


export class MovementMSSQLRepository implements MovementRepository{

    async all(): Promise<Movement[]>{
        const pool = await connector
        const result = await pool.query`SELECT * FROM wallet_movement ORDER BY id DESC`
        
        return result.recordset     
    }
    
    
    async find(id: number): Promise<Movement | null>{
        const pool = await connector
        const result = await pool.query`SELECT * FROM wallet_movement WHERE id =${id}`
        
        if(result.rowsAffected){
            return result.recordset[0]
        }

        return null
    }

    async store(entry: Movement): Promise<void>{
        const pool = await connector
        const now = new Date()
        const result = await pool.query
        `INSERT INTO wallet_movement(user_id, type, amount, created_at) 
         VALUES(${entry.user_id}, ${entry.type}, ${entry.amount}, ${now} )`
    }
}