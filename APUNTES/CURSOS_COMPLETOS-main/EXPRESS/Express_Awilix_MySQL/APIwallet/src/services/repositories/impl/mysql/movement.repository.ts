import connector from '../../../../common/persistence/mysql.persistence'
import { Movement } from "../../domain/movement";
import { MovementRepository } from "../../movement.repository";


export class MovementMySQLRepository implements MovementRepository{

    async all(): Promise<Movement[]>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_movement ORDER BY id DESC' 
        )

        return rows as Movement[]
        
    }
    
    
    async find(id: number): Promise<Movement | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_movement WHERE id = ?', 
            [id]
        )
            if(rows.length){
                return rows[0] as Movement
            }
            
            return null
    }

    async store(entry: Movement): Promise<void>{
        const now = new Date();

        await connector.execute(
            'INSERT INTO wallet_movement(user_id, type, amount, created_at) VALUES(?,?,?,?)',
            [entry.user_id, entry.type, entry.amount, now]  
        )
    }
}