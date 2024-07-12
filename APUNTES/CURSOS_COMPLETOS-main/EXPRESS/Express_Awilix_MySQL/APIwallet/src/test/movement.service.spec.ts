import assert from 'assert'
import { MovementService } from '../services/movement.service'
import { MovementMockRepository } from '../services/repositories/impl/mock/movement.mock.repository'
import { BalanceMockRepository } from '../services/repositories/impl/mock/balance.mock.repository'
import { MovementCreateDto } from '../dtos/movement.dtos'


const movementService = new MovementService( new MovementMockRepository(), new BalanceMockRepository)

describe('Movement.Service', ()=>{
    describe('Store', ()=>{
        it('Try to register an income movement', async()=>{
            await movementService.store({
                user_id:1,
                type:0,
                amount: 200
            }as MovementCreateDto)
        })

        it('Try to register an outcome movement', async()=>{
            await movementService.store({
                user_id:1,
                type:1, //le cambio el tipo en el outcome
                amount: 100
            }as MovementCreateDto)
        })

        it('Try to register an outcome movement with insufficient balance', async()=>{
            try {
                await movementService.store({
                    user_id:1,
                    type:1,
                    amount: 100
                }as MovementCreateDto)
                
            } catch (error:any) {
                assert.equal(error.message, "User does not have enough balance")
            }
            
        })

        //debería saltar la ApplicationException
      /*  it('Try to register an unexpected movement', async ()=>{
            try {
                await movementService.store({
                    user_id:1,
                    type:1,
                    amount: 100
                }as MovementCreateDto)
                
            } catch (error:any) {
                assert.equal(error.message, "Invalid movement type supplied")
            }
        })*/

    })
})