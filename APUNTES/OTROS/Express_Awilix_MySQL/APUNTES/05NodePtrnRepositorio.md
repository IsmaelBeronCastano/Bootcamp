# NODE Patrón Repositorio - Pruebas Unitarias

- Creo una instancia de la base de datos, un mock para hacer las pruebas
- Vamos a simular la primary key ( auto incremental )
- El método store de MovementService es el que más me interesa testear
- common/persistence/mock.persistence.ts

~~~js
export const db ={
    balance:[{
        id: 1,
        user_id:1,
        amount: 100
    },{
        id: 2,
        user_id:2,
        amount: 100
    }, {
        id: 3,
        user_id:3,
        amount: 100
    }],
    movement:[],
    subscription:[],
    balance_id: 0,
    movement_id: 0,
    subscription_id: 0
}

//id autoi_ncremental (mala práctica, pero al no haber deletes se acepta para el mock)
db.balance_id = db.balance.length
~~~
------

## Mock repository

- Despues de definir la base de datos fake creo un nuevo repositorio
- Copio el MovementMSSQLRepository y lo pego en mock.repository.ts
- Cambio el connector, lo llamo deb y lo importo de mock.persistence.ts
- services/repositories/impl/mock/mock.repository.ts

~~~js
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
~~~

- balance.mock.repository.ts

~~~js
import {db} from "../../../../common/persistence/mock.persistence";
import { Balance } from "../../domain/balance";
import { BalanceRepository } from "../../balance.repository";

export class BalanceMockRepository implements BalanceRepository {
    public async find(id: number): Promise<Balance | null> {
        const table = db.balance as Balance[];
        const result = table.find(x => x.id === id);

        if (result) {
            return Object.assign({ ...result });
        }

        return null;
    }

    public async findByUserAndCode(userId: number): Promise<Balance | null> {
        const table = db.balance as Balance[];
        const result = table.find(x => x.user_id === userId);

        if (result) {
            return Object.assign({ ...result });;
        }

        return null;
    }

    public async all(): Promise<Balance[]> {
        const table = db.balance as Balance[];
        return Object.assign([...table]);
    }

    public async store(entry: Balance): Promise<void> {
        const table = db.balance as Balance[];
        const now = new Date();

        // set id value
        db.balance_id++;

        table.push({
            id: db.balance_id,
            amount: entry.amount,
            user_id: entry.user_id,
            created_at: now,
            updated_at: null
        } as Balance);
    }

    public async update(entry: Balance): Promise<void> {
        const table = db.balance as Balance[];
        const now = new Date();

        let originalEntry = table.find(x => x.id === entry.id);

        if (originalEntry) {
            originalEntry.user_id = entry.user_id;
            originalEntry.amount = entry.amount;
            originalEntry.updated_at = now;
        }
    }

    public async remove(id: number): Promise<void> {
        let table = db.balance as Balance[];

        table = table.filter(x => x.id !== id);
    }
}
~~~

- subscription.mock.repository.ts

~~~js
import {db} from "../../../../common/persistence/mock.persistence";
import { SubscriptionRepository } from "../../subscription.repository";
import { Subscription } from "../../domain/subscription";

export class SubscriptionMockRepository implements SubscriptionRepository {
    public async find(id: number): Promise<Subscription | null> {
        const table = db.subscription as Subscription[];
        const result = table.find(x => x.id === id);

        if (result) {
            return Object.assign({ ...result });
        }

        return null;
    }

    public async findByUserAndCode(userId: number, code: string): Promise<Subscription | null> {
        const table = db.subscription as Subscription[];
        const result = table.find(x => x.user_id === userId && x.code === code);

        if (result) {
            return Object.assign({ ...result });;
        }

        return null;
    }

    public async all(): Promise<Subscription[]> {
        const table = db.subscription as Subscription[];
        return Object.assign([...table]);
    }

    public async store(entry: Subscription): Promise<void> {
        const table = db.subscription as Subscription[];
        const now = new Date();

        // set id value
        db.subscription_id++;

        table.push({
            id: db.subscription_id,
            code: entry.code,
            amount: entry.amount,
            user_id: entry.user_id,
            cron: entry.cron,
            created_at: now,
            updated_at: null,
        } as Subscription);
    }

    public async update(entry: Subscription): Promise<void> {
        const table = db.subscription as Subscription[];
        const now = new Date();

        let originalEntry = table.find(x => x.id === entry.id);

        if (originalEntry) {
            originalEntry.code = entry.code;
            originalEntry.user_id = entry.user_id;
            originalEntry.amount = entry.amount;
            originalEntry.cron = entry.cron;
            originalEntry.updated_at = now;
        }
    }

    public async remove(id: number): Promise<void> {
        let table = db.subscription as Subscription[];

        table = table.filter(x => x.id !== id);
    }
}
~~~
------

## MOCHA

- Instalo mocha

> npm i --save-dev mocha @types/mocha

- Creo la carpeta src/test/movement.service.spec.ts
- Importo assert
- El esqueleto de las pruebas sería este

~~~js
import assert from 'assert'

describe('Movement.Service', ()=>{
    describe('Store', ()=>{
        it('Try to register an income movement', ()=>{

        })

        it('Try to register an outcome movement', ()=>{

        })

        it('Try to register an outcome movement with insufficient balance', ()=>{

        })

        //debería saltar la ApplicationException
        it('Try to register an unexpected movement', ()=>{

        })

    })
})
~~~

- Necesito importar el servicio de Movement. Me salgo del contenedor de dependencias por lo que debo instanciar la clase
- Le paso en el constructor las dependencias necesarias
- La primera prueba
- Para ejecutar mocha genero un script en el json

> "test":"mocha -r ts-node/register src/test/**.spec.ts",


~~~js
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
                    type:999, //modificoel tipo para que sale el error (no puedo, salta terror de typescript)
                    amount: 100
                }as MovementCreateDto)
                
            } catch (error:any) {
                assert.equal(error.message, "Invalid movement type supplied")
            }
        })*/

    })
})
~~~

- Todos pasan!!

