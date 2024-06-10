# NODE Patron Repositorio - Kodoti APIwallet - MySQL & Repository

- Faltan los repositorios de Movement y Balance
- Creo las interfaces para mapear las columnas de la DB. 
- Lo hago en la carpeta services/repositories/domain/
- movement.ts

~~~js
export interface Movement{
    id: number
    user_id: number
    type: number  // si es 0 es un incoming (ingreso) si es outcome es un pago. Lo voy a trabajar con un enum
    amount: number
    created_at: Date | null
    updated_at: Date | null
}
~~~

- balance.ts

~~~js
export interface Balance{
    id: number
    user_id: number
    amount: number
    created_at: Date | null
    updated_at: Date | null
}
~~~

- Creo en /common/enums/movement-types.ts el enum
- De esta manera el código será mucho más comprensible ( ya sí no trabajamos con "numeros mágicos")

~~~js
export enum MovementType{
    income = 0,
    outcome=1
}
~~~

- Añado el tipo enum a la interfaz

~~~js
import { MovementType } from "../../../common/enums/movement-types"

export interface Movement{
    id: number
    user_id: number
    type: MovementType
    amount: number
    created_at: Date | null
    updated_at: Date | null
}
~~~

- Creo las interfaces para los repositorios en services/repositories
- Son para los métodos que quiero si o si implementar. Estos van a ser siempre un CRUD completo
- Dónde haré las consultas directamente a la DB
- La lógica de negocio va a estar en el servicio
- Utilizo la interfaz de /domain/movement.ts para indicar el tipod e dato de retorno de la DB
- Los métodos devuelven una promesa porque así funciona el conector que importamos de la pool que exportamos de mysql.persistence para interactuar con la DB
- movement.repository.ts

~~~js
import { Movement } from "./domain/movement"

export interface MovementRepository{
    all: ()=> Promise<Movement[]>
    find: (id: number)=> Promise<Movement | null>
    store: (entry: Movement)=> Promise<void>
}

~~~

- BalanceRepository es idéntica a MovementRepository solo que tiene el método findByUserAndCode
- Uso la interfaz de Balance para tipar el dato de retorno de la promesa
- balance.repository.ts

~~~js
import { Balance } from "./domain/balance"


export interface BalanceRepository{
    all: ()=> Promise<Balance[]>
    find: (id: number)=> Promise<Balance | null>
    findByUserAndCode: (id: number)=> Promise<Balance | null>
    store: (entry: Balance)=> Promise<void>
    update: (entry: Balance)=> Promise<void>
    remove: (id: number)=>Promise<void>
}
~~~

- Creo los repositorios en /repositories/impl/mysql/
- Creo el esqueleto de los métodos, importo las interfaces y el conector

~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Movement } from "../../domain/movement";
import { MovementRepository } from "../../movement.repository";


export class MovementMySQLRepository implements MovementRepository{

    all(): Promise<Movement[]>{

        
    }
    
    
    find(id: number): Promise<Movement | null>{

    }

    store(entry: Movement): Promise<void>{

    }

    update(entry: Movement): Promise<void>{

    }

    remove(id: number): Promise<void>{

    }
}
~~~

- Viene a ser el mismo código que subscription sólo cambiando el nombre de la tabla
- movement.repository.ts

~~~js
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

        await connector.execute(            //hay que ponerlo en el mismo orden que la tabla
            'INSERT INTO wallet_movement(user_id, type, amount, created_at) VALUES(?,?,?,?)',
            //escapo los parámetros
            [entry.user_id, entry,type, entry.amount, entry.type, now]  
        )
    }
}
~~~

- balance.repository.ts

~~~js
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
            'SELECT * FROM wallet_balance WHERE id = ?', //pongo interrogación para evitar inyección de SQL
            
            //va a traer un array igual, pero debería devolver una sola fila
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
        //creo la fecha para created_at
        const now = new Date();

            await connector.execute(
                'INSERT INTO wallet_balance(user_id, amount,created_at) VALUES(?,?,?)',
                //escapo los parámetros
                [entry.user_id, entry.amount, now]  
            )
    }
    
    public async update(entry : Balance): Promise<void>{

        const now = new Date();

            await connector.execute(                                                //le paso el now al updated_at
                'UPDATE wallet_balance SET user_id= ?, amount= ?, updated_at= ? WHERE id = ?',
                //escapo los parámetros                                     
                [entry.user_id, entry.amount, now, entry.id] //este entry.id hace referencia al id del WHERE  
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
~~~
----

## Movement Service

- Creo el archivo /services/movement.services.ts
- Los métodos seran obtener, listar y crear (eliminar y update no, porque un ingreso o pago no debe eliminarse o actualizarse una vez realizado) 
- En el método de crear tengo dos tipos, un ingreso o un cobro ( como detallo en el enum)
- Necesito el balanceRepository para actualizar el balance según el movimiento que haga (ingreso o pago)

~~~js
import { MovementType } from "../common/enums/movement-types";
import { ApplicationException } from "../common/exception/application.exception";
import { MovementCreateDto } from "../dtos/movement.dtos";
import { BalanceRepository } from "./repositories/balance.repository";
import { Movement } from "./repositories/domain/movement";
import { MovementRepository } from "./repositories/movement.repository";

export class MovementService{
    constructor(
        private readonly movementRepository: MovementRepository,
        private readonly balanceRepository: BalanceRepository
    ){}

    public async all(): Promise<Movement[]>{
        return await this.movementRepository.all()
    }

    public async find(id: number): Promise<Movement | null>{
        return await this.movementRepository.find(+id)
    }

    public async store(entry: MovementCreateDto): Promise<void>{
        //cuando quiere crear un movimiento tiene dos tipos: un ingreso o un pago
        //necesito el balanceRepository para que cuando haga un movimiento se actualice el balance
        
        //traigo el balance actual
        const balance = await this.balanceRepository.findByUserAndCode(entry.user_id)

        //según sea del tipo income u outcome del enum de MovementType será una lógica u otra
        if(entry.type === MovementType.income){

        }else if(entry.type === MovementType.outcome){

        }else{
            throw new ApplicationException('Invalid Movement Type supplied')//error de tipo Application porque es un error del cliente
        }

    }
}
~~~

- Creo el MovementCreateDto

~~~js
import { MovementType } from "../common/enums/movement-types";

export interface MovementCreateDto{
    type: MovementType
    user_id: number
    amount: number
}
~~~

- En lugar de escribir todo el código en el método store del MovementService, vamos a hacerlo con pequeñas funciones
- Recuerda que el código debe ser simple de leer
- Creo un nuevo método llamado **income**, le paso el dto y el balance
- Empiezo validando si el balance existe
- Si no existe, como estoy en el income (ingreso), lo creo con el repositorio balance
- Tipo el objeto as Balance
- Por el contrario, si lo tengo, lo sumo al amount existente y actualizo con el método update de balance
- Por último, registro el movimiento con el método store de movement
- Para el **outcome**
- Compruebo si el balance existe y si tengo el monto suficiente para la operación
- Arrojo un error si no lo tengo
- En caso contrario, si tengo un balance le resto el amount del entry
- Hago el update y registro el movimiento
- 
~~~js
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
        //cuando quiere crear un movimiento tiene dos tipos: un ingreso o un pago
        //necesito el balanceRepository para que cuando haga un movimiento se actualice el balance
        
        //traigo el balance actual
        const balance = await this.balanceRepository.findByUserAndCode(entry.user_id)

        //según sea del tipo income u outcome del enum de MovementType será una lógica u otra
        if(entry.type === MovementType.income){
            await this.income(entry, balance)
        }else if(entry.type === MovementType.outcome){
            await this.outcome(entry, balance)
        }else{
            throw new ApplicationException('Invalid Movement Type supplied')//error de tipo Application porque es un error del cliente
        }

    }
    private async income(entry: MovementCreateDto, balance: Balance | null){
        if(!balance){
            //si no tengo un balance pero hago un ingreso de 200 tengo un balance de 200
            //creo el balance
            await this.balanceRepository.store({
                amount: entry.amount,
                user_id: entry.user_id
            } as Balance)
        }else{
            balance.amount += entry.amount //en el caso de que exista el sumo el amount y hago el update
            await this.balanceRepository.update(balance)
        }
        //registro el movimiento
        await this.movementRepository.store(entry as Movement) //el MovementCreateDto tiene los 3 campos que calzan con Movement
                                                            
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
~~~
-----

## Inyección de depndencia, Enrutamiento y testeo

- Registro las dependencias en el container para poder trabajar con ellas en el controlador

~~~js
import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { SubscriptionMySQLRepository } from './services/repositories/impl/mysql/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { MovementMySQLRepository } from './services/repositories/impl/mysql/movement.repository';
import { MovementService } from './services/movement.service';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        //repositories
        subscriptionRepository: asClass(SubscriptionMySQLRepository).scoped(),
        movementRepository: asClass(MovementMySQLRepository).scoped(),
        balanceRepository: asClass(BalanceMySQLRepository).scoped(),

        //services
        testService: asClass(TestService).scoped(),
        subscriptionService: asClass(SubscriptionService).scoped(),
        movementService: asClass(MovementService).scoped()

    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}
~~~

- Creo el controlador

~~~js
import {Request, Response} from 'express'
import { GET, POST, route } from "awilix-express";
import { BaseController } from "../common/controllers/base.controller";
import { MovementService } from "../services/movement.service";
import { MovementCreateDto } from '../dtos/movement.dtos';

@route('/movement')
export class MovementController extends BaseController{
    constructor(private readonly movementService: MovementService){
        super() //llamo al super porque extiendo de una clase abstracta para lanzar los errores (BaseController)
    }
    @GET()
    public async all(req:Request, res:Response){

        try {
            res.send(
                return await this.movementService.all()
                
            )
        } catch (error) {
            this.handleException(error, res)
        }
    }
    @route('/:id')
    @GET()
    public async find(req:Request, res:Response){
        try {
            const id = req.params.id
            const result =  await this.movementService.find(+id)
            
            if(result){
                res.send(result)

            }else{
                res.status(404)
                res.send()
            }

            
        } catch (error) {
            this.handleException(error, res)
        }
    }

    @POST()
    public async store(req:Request, res: Response){
        try {
            await this.movementService.store({
                user_id: req.body.user_id,
                amount: req.body.amount,
                type: req.body.type
            } as MovementCreateDto)
    
            res.send() //status 200
            
        } catch (error) {
            this.handleException(error, res)
        }
    }
}
~~~
------

## TESTEO

- En el método POST con la ruta //localhost:3000/movement en ThunderClient/Postman añado en el body esto

~~~json
{
  "type": 0,
  "user_id": 1,
  "amount": 200
}
~~~
- **NOTA**: desactivar modo estricto desde workbench en Preferences, SQLEditor, desactivar campo SafeUpdates


