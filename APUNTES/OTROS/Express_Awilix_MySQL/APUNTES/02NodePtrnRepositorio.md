# NODE Patrón repositorio MySQL

- MySQL instalado
- Usaré MySQL Workbench
- Creo la base de datos KodotiWallet
- Instalo con npm i mysql2 y los tipos con types/mysql
- Creo una carpeta en src/common/ llamada persistence con mysql.persistence.ts
- Me puedo conectar con createConnection y createPool, la segunda es un poco más interesante
  - Si una instancia ya está liberada para la conexión te la brinda
  - createConnection se comportaría como un Singleton
- Trabajaremos con createPool
- Lo importo de mysql2/promise para poder hacer uso de las promesas
  - Sin esto tendríamos que usar un callback en el query para que nos responda esa petición asíncrona

~~~js
//sin promesas
query(()=>{

})

//más limpio usar await query()
~~~

- Uso decimalNumbers: true para trabajar con números en los objetos y no con cadenas (20 en lugar de "20")
- mysql.persistence.ts

~~~js
import {createPool} from 'mysql2/promise'



export default createPool({
    host: process.env.db_mysql_host,
    user: process.env.db_mysql_user,
    password: process.env.db_mysql_password,
    database: process.env.db_mysql_database,
    decimalNumbers: true //habilita que retorne los numeros en los objetos como números y no como strings
})

//todos estos valores hay que setearlos en el archivo .env de development.env

/*
db_mysql_host=localhost
db_mysql_user=root
db_mysql_password=root
db_mysql_database=kodotiwallet
*/
~~~
-----

## Repositorio - métodos de lectura

- Creo la carpeta domain en src/services/repositories/
- También la carpeta impl (de implementación) dentro de /repositories
- Vamos a empezar a cear nuestra clase de dominio
- Creo en /domain/subscription.ts
- No lo voy a trabajar como una clase sino como una interfaz
    - Va a contener los campos que tiene mi tabla (creo la tabla con estos campos en Workbench)
- Creación de la tabla

~~~js
CREATE TABLE `kodotiwallet`.`wallet_subscription` (
  `id` INT NOT NULL AUTO INCREMENT, //y auto increment!!
  `user_id` INT NOT NULL,
  `code` VARCHAR(45) NULL,
  `amount` DECIMAL NULL,
  `cron` VARCHAR(45) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`));
~~~

- La interfaz sería (en /domain/subscription.ts)

~~~js
export interface Subscription{
    id: number
    code: string
    user_id: number
    amount: number
    cron: string
    created_at: Date | null
    updated_at: Date | null
}
~~~

- Uso la interfaz porque es más fácil de usar que una clase
- La clase tengo que instanciarla, pasarle los valores a través del constructor y es tedioso
- En /impl creo la carpeta /mysql ( habrán otras para mysql_server y otra para las pruebas unitarias)
- Creo en src/repositories/impl/mysql/subscription.repository.ts para crear la clase SubscriptionRepository
- Importo de /common/persistence/mysql.persistence para conectar a mysql
  - Como hice un export default puedo llamarlo como quiera
- execute (que es asíncrono) me retorna un array, y dentro del array retorna otros arrays
    - Dónde están las filas encontradas en la base de datos va a ser en el índice 0
    - A través de la desestructuración de arrays vamos a acceder al índice 0 con rows entre corchetes
- Hago un casteo de rows y le digo que serán un array del tipo de la interfaz
- Cómo trabajo con una promesa, el retorno del método all será una  promesa de tipo Subscription[] 

~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'

export class SubscriptionRepository{

    public async all(): Promise<Subscription[]>{

        const [rows] = await connector.execute(
            'SELECT * FROM wallet_subscription ORDER BY id DESC' 
        )

            //Si trabajara con clases en lugar de una interfaz aquí tendría que instanciar la clase Subscription
            //y pasarle por el constructor parametro 1, parámetro 2, etc

        return rows as Subscription[];
    }
}
~~~

- Creo el find (para encontrar un solo registro)
- Le pongo id = ? para evitar inyección de SQL
- El siguiente parámetro son los parámetros que queramos escapar en el orden que se vayan declarando las interrogaciones o comodines
- Va a traer un array igual, pero debería encontrar una sola fila por el id
- En el caso de que no haya registros voy a retornar un null
- Uso any[] como tipo para poder acceder al .length y hacer el if pra comprobar que haya registros o no
  - Debo agregar null al valor de retorno del método, el tipo Subscription ya no es un array
~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'


export class SubscriptionRepository{

    public async all(): Promise<Subscription[]>{
        const [rows] = await connector.execute(
            'SELECT * FROM wallet_subscription ORDER BY id DESC' 
        )

        return rows as Subscription[]
    }
    public async find(id: Number): Promise<Subscription | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_subscription WHERE id = ?', //pongo interrogación para evitar inyección de SQL
            
            //va a traer un array igual, pero debería devolver una sola fila
            [id]
        )
            if(rows.length){
                return rows[0] as Subscription //el valor de retorno del método es Subscription pero ya no es un array
            }
            
            return null  //debo agregar este tipo al valor de retorno del método
    }
}
~~~
-----

## Repositorio - métodos de escritura

- Escribo los querys y le paso en un arreglo (en el mismo orden) las propiedades
- Uso la fecha para pasarle en la posición del arreglo de created_at una fecha
- En update, le paso la fecha, y el siguiente parámetro en el array corresponde al id
- En delete solo necesito el id

~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'


export class SubscriptionRepository{

    public async all(): Promise<Subscription[]>{
        const [rows] = await connector.execute(
            'SELECT * FROM wallet_subscription ORDER BY id DESC' 
        )

        return rows as Subscription[]
    }
    public async find(id: Number): Promise<Subscription | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_subscription WHERE id = ?', //pongo interrogación para evitar inyección de SQL
            
            //va a traer un array igual, pero debería devolver una sola fila
            [id]
        )
            if(rows.length){
                return rows[0] as Subscription
            }
            
            return null
    }

    public async store(entry : Subscription): Promise<void>{
        //creo la fecha para created_at
        const now = new Date();

            await connector.execute(
                'INSERT INTO wallet_subscription(user_id, code, amount, cron, created_at) VALUES(?,?,?,?,?)',
                //escapo los parámetros
                [entry.user_id, entry.code, entry.amount, entry.cron, now]  
            )
    }
    
    public async update(entry : Subscription): Promise<void>{

        const now = new Date();

            await connector.execute(                                                //le paso el now al updated_at
                'UPDATE wallet_subscription SET user_id= ?, code= ?, amount= ?, cron=?, updated_at= ? WHERE id = ?',
                //escapo los parámetros                                     
                [entry.user_id, entry.code, entry.amount, entry.cron, now, entry.id] //este entry.id hace referencia al id del WHERE de la consulta 
            )
    }
    
    public async remove(id: number): Promise<void>{

        await connector.execute(
            'DELETE FROM wallet_subscription WHERE id= ?',
            //le paso el id
            [id]
        )
 
    }
} 
~~~
------

## Repositorio - Interfaces e inyección de dependencias

- Voy a comenzar a trabajar con intyerfaces para que lo implementen mis repositorios
- Las interfaces me van a ayudar a si tengo que cambiar de DB, el contrato ya está definido
- Renombro la clase SubscriptionRepository a SubscriptionMySQLRepository
- Creo a nivel de carpeta dentro de repositories el archivo subscription.repository.ts
- /repositories/subscription.repository.ts

~~~js
import { Subscription } from "./domain/subscription"


export interface SubscriptionRepository{
    all: ()=> Promise<Subscription[]>
    find: (id: number)=> Promise<Subscription | null>
    store: (entry: Subscription)=> Promise<void>
    update: (id: number, entry: Subscription)=> Promise<void>
    remove: (id: number)=>Promise<void>
}
~~~

- Le digo a la clase SubscriptionMySQLRepository que implemente la interfaz

~~~js
import connector from '../../../../common/persistence/mysql.persistence'
import { Subscription } from '../../domain/subscription'
import { SubscriptionRepository } from '../../subscription.repository'

                                        //implemento la interfaz
export class SubscriptionMySQLRepository implements SubscriptionRepository {

    public async all(): Promise<Subscription[]>{
        const [rows] = await connector.execute(
            'SELECT * FROM wallet_subscription ORDER BY id DESC' 
        )

        return rows as Subscription[]
    }
    public async find(id: Number): Promise<Subscription | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_subscription WHERE id = ?', //pongo interrogación para evitar inyección de SQL
            
            //va a traer un array igual, pero debería devolver una sola fila
            [id]//le paso el id
        )
            if(rows.length){
                return rows[0] as Subscription
            }
            
            return null
    }

    public async store(entry : Subscription): Promise<void>{
        //creo la fecha para created_at
        const now = new Date();

            await connector.execute(
                'INSERT INTO wallet_subscription(user_id, code, amount, cron, created_at) VALUES(?,?,?,?,?)',
                //escapo los parámetros
                [entry.user_id, entry.code, entry.amount, entry.cron, now]  
            )
    }
    
    public async update(entry : Subscription): Promise<void>{

        const now = new Date();

            await connector.execute(                                                //le paso el now al updated_at
                'UPDATE wallet_subscription SET user_id= ?, code= ?, amount= ?, cron=?, updated_at= ? WHERE id = ?',
                //escapo los parámetros                                     
                [entry.user_id, entry.code, entry.amount, entry.cron, now, entry.id] //este entry.id hace referencia al id del WHERE  
            )
    }
    
    public async remove(id: number): Promise<void>{

        await connector.execute(
            'DELETE FROM wallet_subscription WHERE id= ?',
            //le paso el id
            [id]
        )
 
    }
}
~~~

- Ahora lo que hay que hacer es registrar esta clase ene l contenedor de dependencias
- container.ts

~~~js
import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { SubscriptionMySQLRepository } from './services/repositories/impl/mysql/subscription.repository';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        //repositories
        subscriptionRepository: asClass(SubscriptionMySQLRepository).scoped(),

        //services
        testService: asClass(TestService).scoped()
    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}
~~~

- Esta dependencia ya va a estar disponible para inyectarse en los constructores
-----

## Capa de servicio

- En /services/subscription.service.ts
- Par el store y el update voy a crear DTOs
- services/subscription.service.ts

~~~js
import { Subscription } from "./repositories/domain/subscription";
import { SubscriptionRepository } from "./repositories/subscription.repository";



export class SubscriptionService{
    constructor(
        private readonly subscriptionRepository: SubscriptionRepository
    ){}
        public async all(): Promise<Subscription[]>{
        return await this.subscriptionRepository.all()
        }

        public async find(id: number): Promise<Subscription | null>{
            return await this.subscriptionRepository.find(id)
        }

        public async store(): Promise<void>{
           
        }
        
        public async update(): Promise<void>{
           
        }
        
        public async remove(id: number): Promise<void>{
            return await this.subscriptionRepository.remove(id)
        }
}
~~~

- Creo los DTOs en /src/dtos/subscription.dtos.ts
- El id, created_at y updated_at no me interesan

~~~js
export interface SubscriptionCreateDto{
    code: string
    user_id: number
    amount: number
    cron: string
}

export interface SubscriptionUpdateDto{
    code: string 
    //según las reglas de negocio que aplico el user_id no lo necesito en update
    amount: number
    cron: string
}
~~~
- Le paso el tipo SubscriptionCreateDto al argumento del método store
- En el store tengo que verificar si el usuario existe primero.
- Para ello creo un nuevo método en /repositories/impl/mysql/subscription.repository.ts

~~~js
    public async findByUserAndCode(user_id: Number, code: string): Promise<Subscription | null>{
        const [rows]: any[] = await connector.execute(
            'SELECT * FROM wallet_subscription WHERE user_id = ? AND code= ?', //pongo interrogación para evitar inyección de SQL, añado code
            
            
            [user_id, code]
        )
            if(rows.length){
                return rows[0] as Subscription
            }
            
            return null
    }
~~~

- Debo añadir este método a la interfaz

~~~js
import { Subscription } from "./domain/subscription"

export interface SubscriptionRepository{
    all: ()=> Promise<Subscription[]>
    find: (id: number)=> Promise<Subscription | null>
    findByUserAndCode: (id: number, code: string)=> Promise<Subscription | null>
    store: (entry: Subscription)=> Promise<void>
    update: (entry: Subscription)=> Promise<void>
    remove: (id: number)=>Promise<void>
}
~~~

- Ahora ya puedo usarlo en subscription.service.ts

~~~js
import { SubscriptionCreateDto } from "../dtos/subscription.dtos";
import { Subscription } from "./repositories/domain/subscription";
import { SubscriptionRepository } from "./repositories/subscription.repository";



export class SubscriptionService{
    constructor(
        private readonly subscriptionRepository: SubscriptionRepository
    ){}
        public async all(): Promise<Subscription[]>{
        return await this.subscriptionRepository.all()
        }

        public async find(id: number): Promise<Subscription | null>{
            return await this.subscriptionRepository.find(id)
        }

        public async store(entry: SubscriptionCreateDto): Promise<void>{
           //el user_id y el code son únicos, me sirven para vaidar si existe
           //uso el método que he creado en subscription.repository

           const originalEntry = await this.subscriptionRepository.findByUserAndCode(entry.user_id, entry.code)

           if(!originalEntry){
           await this.subscriptionRepository.store(entry as Subscription) //lo transformo al tipo Subscription
           }else{
                //retorno un error
           }

        }
        
        public async update(): Promise<void>{
           
        }
        
        public async remove(id: number): Promise<void>{
            return await this.subscriptionRepository.remove(id)
        }
}
~~~

- Quiero devolver un error personalizado
- en /src/common/exception/application.exception.ts creo la clase ApplicationException
- Le digo que herede de Error

~~~js
export class ApplicationException extends Error{
    constructor(message: string = 'An unexpected error ocurred'){
        super(message)
    }
}
~~~

- Puedo lanzar el error en el else del método store del servicio
- Hago el update

~~~js
public async store(entry: SubscriptionCreateDto): Promise<void>{
    //el user_id y el code son únicos, me sirven para vaidar si existe
    //uso el método que he creado en subscription.repository

    const originalEntry = await this.subscriptionRepository.findByUserAndCode(entry.user_id, entry.code)

    if(!originalEntry){
    await this.subscriptionRepository.store(entry as Subscription) //lo transformo al tipo Subscription
    }else{
        throw new ApplicationException("User subscription already exists")
    }

}

public async update(id: number, entry: SubscriptionUpdateDto): Promise<void>{
    const originalEntry = await this.subscriptionRepository.find(id)

    if(originalEntry){
        //actualizo los valores
        originalEntry.code = entry.code,
        originalEntry.amount = entry.amount,
        originalEntry.cron= entry.cron

        //guardo en la DB
        await this.subscriptionRepository.update(originalEntry)
    }else{
        throw new ApplicationException("Subscription not found")
    }

}
~~~
----

## Controlador y definición de rutas

- Ahora vamos a registrar el servicio creado en el contenedor de dependencias 

~~~js
import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { SubscriptionMySQLRepository } from './services/repositories/impl/mysql/subscription.repository';
import { SubscriptionService } from './services/subscription.service';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
    //aquí registro mis dependencias. Uso asClass para indicarle que es una clase. Uso .scoped() al final
    container.register({
        //repositories
        subscriptionRepository: asClass(SubscriptionMySQLRepository).scoped(),

        //services
        testService: asClass(TestService).scoped(),
        subscriptionService: asClass(SubscriptionService).scoped() 
    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}
~~~

- En los servicios no necesito interfaz porque lo único que van a cambiar son los repositorios
- Ahora que ya tengo mapeada la dependencia creo el controlador en /src/controllers/subscription.controller.ts
- Le inyecto el servicio en el constructor como dependencia
- Debo escribir la palabra private para disponer de ello dentro de la clase. Readonly lo protege
- Uso los decoradores de awilix-express
~~~js
import { Request, Response } from "express";
import { route, GET } from "awilix-express";
import { SubscriptionService } from "../services/subscription.service";


@route('/subscription')
export class SubscriptionController{
    //inyecto como dependencia el servicio
    constructor(private readonly subscriptionService:SubscriptionService){}

    @GET()
    public async all(req:Request, res: Response) {
        res.send(

            await this.subscriptionService.all()
        )
    }
}
~~~

- Para el find extraigo el id del req.params
- Lo casteo a number porque viene como string

~~~js
import { Request, Response } from "express";
import { route, GET } from "awilix-express";
import { SubscriptionService } from "../services/subscription.service";


@route('/subscriptions')
export class SubscriptionController{
    //inyecto como dependencia el servicio
    constructor(private readonly subscriptionService:SubscriptionService){}

    @GET()
    public async all(req:Request, res: Response) {

        res.send(
            
            await this.subscriptionService.all()
        )
    }

    @route('/:id')
    @GET()
    public async find(req: Request, res: Response){
        const id = req.params.id
        res.send(
            
            await this.subscriptionService.find(+id)
        )
    }
}
~~~

- Creo el método POST

~~~js
    @POST()
    public async store(req: Request, res: Response){
    
        await this.subscriptionService.store({
            user_id: req.body.user_id, //tengo la info en el body de la request
            code: req.body.code,
            amount: req.body.amount,
            cron: req.body.cron
        } as SubscriptionCreateDto) //tiene que responder al DTO
        
        res.send() //status 200
    }
~~~

- Creo el método PUT y DELETE.
- El controlador queda así

~~~js
import { Request, Response } from "express";
import { route, GET, POST, PUT, DELETE } from "awilix-express";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionCreateDto, SubscriptionUpdateDto } from "../dtos/subscription.dtos";


@route('/subscriptions')
export class SubscriptionController{
    //inyecto como dependencia el servicio
    constructor(private readonly subscriptionService:SubscriptionService){}

    @GET()
    public async all(req:Request, res: Response) {

        res.send(

            await this.subscriptionService.all()
        )
    }

    @route('/:id')
    @GET()
    public async find(req: Request, res: Response){
        const id = req.params.id
        res.send(

            await this.subscriptionService.find(+id)
        )
    }

    @POST()
    public async store(req: Request, res: Response){
    
        await this.subscriptionService.store({
            user_id: req.body.user_id,
            code: req.body.code,
            amount: req.body.amount,
            cron: req.body.cron
        } as SubscriptionCreateDto)

        res.send() //status 200
    }

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response){
        const id = req.params.id

        await this.subscriptionService.update(+id, {
            code: req.body.code,
            amount: req.body.amount,
            cron: req.body.cron
        } as SubscriptionUpdateDto)

    }

    @route('/:id')
    @DELETE()
    public async remove(req: Request, res: Response){

        const id= req.params.id

        await this.subscriptionService.remove(+id)
    }
}
~~~
------

## Trabajando con excepciones y testeando

- Hay que mejorar el código para poder manejar los errores
- Quiero que toda ApplicationException ( la clase que creé para lanzar un error) sea un error del lado del cliente
- Por lo tanto debería responderle con un BadRequest, pero no puedo hacer un badRequest desde el controlador
- Lo que hago es crear un controlador base en /common/controllers/base.controller.ts
- Va a ser una clase abstracta que la van a heredar todos los controladores
- Le pongo que error es de tipo any porque puede ser de tipo ApplicationException o de tipo Error (de new Error())

~~~js
import { Response } from "express";
import { ApplicationException } from "../exception/application.exception";

export abstract class BaseController{

    handleException(err: any, res: Response){
        if(err instanceof ApplicationException){
            res.status(400)
            res.send()
        }else{
            throw new Error()
        }
    }
}
~~~

- Hago que el controlador herede de esta clase Abstracta
- Tengo que usar super para que herede
- Uso un try y un catch para atrapar el error
- Le paso el error y la response

~~~js
import { Request, Response } from "express";
import { route, GET, POST, PUT, DELETE } from "awilix-express";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionCreateDto, SubscriptionUpdateDto } from "../dtos/subscription.dtos";
import { BaseController } from "../common/controllers/base.controller";


@route('/subscriptions')
export class SubscriptionController extends BaseController{
    //inyecto como dependencia el servicio
    constructor(private readonly subscriptionService:SubscriptionService){
        super()
    }

    @GET()
    public async all(req:Request, res: Response) {

        try {
            res.send(
               await this.subscriptionService.all()
            )
        } catch (error) {
            this.handleException(error, res)
        }
    }

    @route('/:id')
    @GET()
    public async find(req: Request, res: Response){
        const id = req.params.id

        try {
            res.send(
                await this.subscriptionService.find(+id)
            )
            
        } catch (error) {
            this.handleException(error, res)
        }
    }

    @POST()
    public async store(req: Request, res: Response){
        
        try {
            await this.subscriptionService.store({
                user_id: req.body.user_id,
                code: req.body.code,
                amount: req.body.amount,
                cron: req.body.cron
            } as SubscriptionCreateDto)
    
            res.send() //status 200
            
        } catch (error) {
            this.handleException(error, res)
        }
    }

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response){
        const id = req.params.id

        try {
            await this.subscriptionService.update(+id, {
                code: req.body.code,
                amount: req.body.amount,
                cron: req.body.cron
            } as SubscriptionUpdateDto)

            res.send()
            
        } catch (error) {
            this.handleException(error, res)
        }

    }

    @route('/:id')
    @DELETE()
    public async remove(req: Request, res: Response){

        const id= req.params.id
        
        try {
            await this.subscriptionService.remove(+id)
            res.send()
        } catch (error) {
            this.handleException(error, res)
        }
    }
}
~~~

- RESUMEN BREVE:
  - En el repositorio tenemos las consultas SQL. Implementa la interfaz
  - En el servicio inyectamos en el constructor el repositorio, previamente registrado en el container
    - El servicio no necesita interfaz. Es dónde establezco la lógica de negocio usando el repositorio (las consultas)
  - Registramos el servicio en el container, y lo inyectamos en el controlador
    - En el controlador tengo las rutas y los métodos del CRUD. Simplemente llamo al servicio y manejo los errores
-----

## REFACTORING

- El método GET para buscar uno en concreto (find) cambia a esto
- Verifico primero que existe, y si no mando un 400

~~~js
    @route('/:id')
    @GET()
    public async find(req: Request, res: Response){
        
        try {
            const id = req.params.id
            const result =  await this.subscriptionService.find(+id)
            
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
~~~
- El método POST (store) también necesita refactorización
- Express no está configurado para trabajar con JSON
- Añado esta linea al servidor, en app.ts

> app.use(express.json())

- Modifico base.controller para poder leer el mensaje de error
- base.controller

~~~js
import { Response } from "express";
import { ApplicationException } from "../exception/application.exception";

export abstract class BaseController{

    handleException(err: any, res: Response){
        if(err instanceof ApplicationException){
            res.status(400)
            res.send(err.message)
            
        }else{
            throw new Error(err)
        }
    }
}
~~~

- Para arreglar BUG de MYSQLWorkbench Region/Administrativo/Cambiar Configuración del sistema/ habilitar checkbox UTF-8
- Reiniciar
- El problema está en que no están disponibles las variables de entorno en el archivo persistence, por lo que algo pasa en la configuración en app.ts con dotenv.config
- Tengo problemas con import.meta.url y el __dirname, por lo que no estan disponibles las variables de entorno en /config/mysql.persistence
- **Pongo las variables de entorno en duro** 
- 
