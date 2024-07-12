import connector from '../../../../common/persistence/mysql.persistence'
import { BalanceRepository } from '../../balance.repository'
import { Balance } from '../../domain/balance'



export class BalanceMySQLRepository implements BalanceRepository {

    public async all(): Promise<Balance[]>{
        const [rows] = await connector.execute(
            'SELECT * FROM wallet_balance ORDER BY id DESC' 
        )

        return rows as Balance[]
    }
    public async find(id: Number): Promise<Balance | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_balance WHERE id = ?', 
            [id]
        )
            if(rows.length){
                return rows[0] as Balance
            }
            
            return null
    }

    public async findByUserAndCode(user_id: Number): Promise<Balance | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_balance WHERE user_id = ?', 
            
            
            [user_id]
        )
            if(rows.length){
                return rows[0] as Balance
            }
            
            return null
    }

    public async store(entry : Balance): Promise<void>{
        
        const now = new Date();

            await connector.execute(
                'INSERT INTO wallet_balance(user_id, amount,created_at) VALUES(?,?,?)',
                [entry.user_id, entry.amount, now]  
            )
    }
    
    public async update(entry : Balance): Promise<void>{

        const now = new Date();

            await connector.execute(                                              
                'UPDATE wallet_balance SET user_id= ?, amount= ?, updated_at= ? WHERE id = ?',                                   
                [entry.user_id, entry.amount, now, entry.id] 
            )
    }
    
    public async remove(id: number): Promise<void>{

        await connector.execute(
            'DELETE FROM wallet_balance WHERE id= ?',
            //le paso el id
            [id]
        )
    }
}