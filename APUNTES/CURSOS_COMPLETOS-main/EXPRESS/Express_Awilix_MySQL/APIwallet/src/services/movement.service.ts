import { MovementType } from "../common/enums/movement-types";
import { ApplicationException } from "../common/exception/application.exception";
import { MovementCreateDto } from "../dtos/movement.dtos";
import { BalanceMySQLRepository} from "./repositories/impl/mysql/balance.repository";
import { Balance } from "./repositories/domain/balance";
import { Movement } from "./repositories/domain/movement";
import { MovementRepository } from "./repositories/movement.repository";

export class MovementService{
    constructor(
        private readonly movementRepository: MovementRepository,
        private readonly balanceRepository: BalanceMySQLRepository
    ){}

    public async all(): Promise<Movement[]>{
        return await this.movementRepository.all()
    }

    public async find(id: number): Promise<Movement | null>{
        return await this.movementRepository.find(+id)
    }

    public async store(entry: MovementCreateDto): Promise<void>{
   
        const balance = await this.balanceRepository.findByUserAndCode(entry.user_id)

       
        if(entry.type === MovementType.income){
            await this.income(entry, balance)
        }else if(entry.type === MovementType.outcome){
            await this.outcome(entry, balance)
        }else{
            throw new ApplicationException('Invalid Movement Type supplied')
        }

    }
    private async income(entry: MovementCreateDto, balance: Balance | null){
        if(!balance){
        
            await this.balanceRepository.store({
                amount: entry.amount,
                user_id: entry.user_id
            } as Balance)
        }else{
            balance.amount += entry.amount 
            await this.balanceRepository.update(balance)
        }
       
        await this.movementRepository.store(entry as Movement) 
                                                           
    } 
    private async outcome(entry: MovementCreateDto, balance: Balance | null){
        if(!balance || balance.amount < entry.amount){
            throw new ApplicationException("User does not have enough balance")
        }else{
            balance.amount -= entry.amount
            await this.balanceRepository.update(balance)
        }
        await this.balanceRepository.update(balance)
        await this.movementRepository.store(entry as Movement)

    } 
}