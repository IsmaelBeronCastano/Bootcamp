# NODE Patrón Repositorio Kodoti Wallet - SQL Server

- Instalar SQL Server
- Instalar SQL Server Management Studio
- Crear la misma tabla, con el mismo nombre, y los mismos campos, en el mismo orden
- Habilitar en Administrador de Configuracion SQL Server
  - Configuracion de red de SQL Server/Protocolos de MSSQLSERVER
    - TCP/IP-> esta en disabled, **habilitar**
- Reinicio el servicio en Servicios de SQL Server/SQL Server (clic derecho, reiniciar)
- En la ventana principal de SQL Server Management, en Authentication, uso la de SQL Authentication
- Creo el usuario en el árbol de la izquierda, Security/Login/New Login
  - Uso username: root, password: root
- Las tablas deben de ser idénticas que las de MySQL
- Instalo con npm i mssql
- Instalo los tipos con npm i --save-dev @types/mssql
- Creo el archivo de conexión (**RECUERDA QUE NO HE SOLUCIONADO EL PATH PARA QUE DETECTE LAS VARIABLES DE ENTORNO, LAS PONGO EN DURO**)
- /common/persistence/mssql.persistence.ts

~~~js
import { ConnectionPool } from 'mssql' ;

let config = {
    server: process.env.deb_mssql_server as string, //casteo a string para que no me de error en la ConnectionPool ç
                                                    //porque por defecto podría ser undefined
    user: process.env.deb_mssql_user as string,
    password: process.env.deb_mssql_password as string,
    database: process.env.deb_mssql_database as string,
    options:{
        enableArithAbort: true
    }
}

export default new ConnectionPool(config).connect()
~~~

- En development.env:

~~~
APP_FOO=development

db_mysql_host=localhost
db_mysql_user=root
db_mysql_password=root
db_mysql_database=kodotiwallet

db_mssql_server=localhost
db_mssql_user=root
db_mssql_password=root
db_mssql_database=kodotiwallet
~~~
-------

## Aplicando el patrón repositorio

- Creo la carpeta del repositorio en services/repositories/impl/mssql
- Copio el archivo movement.repository.ts al directorio
  - Le cambio el nombre a MovementMSSQLRepository
  - La interfaz va a ser la misma
  - Cambio la importación de la conexión a mssql.persistence
  - El connect() del archivo mssql.persistence es una promesa del tipo ConnectionPool
  - Debo esperar que resuelva
  - Uso el template literal
- **EXPLICACIÓN**

~~~js
//Si yo creo la función doSomething con n parametros

function doSomething(...parametros){
  console.log(parametros)
}

//Si le paso parámetros me los va a devolver en un array

doSomething(1,2,3) //[1,2,3]

//Puedo usar un template literal 

doSomething`SELECT * FROM table kodoti_wallet WHERE id=${100}` 
//0: [SELECT * FROM table kodoti_wallet WHERE id=","", raw: Array(2)]
//1:  0
//length: 2

//El primer parámetro es la cadena, y el segundo parámetro son los valores que se escapan entre ${}
~~~

- De esta manera, los valores de las variables que le vaya a pasar en los template literals serán los parámetros que van a pasar dentro del array
- Así va a evitar la inyección SQL

~~~js
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
~~~

- mssql/balance.repository

~~~js
import connector from "../../../../common/persistence/mssql.persistence";
import { Balance } from "../../domain/balance";
import { BalanceRepository } from "../../balance.repository";

export class BalanceMSSQLRepository implements BalanceRepository {
    public async find(id: number): Promise<Balance | null> {
        const pool = await connector;
        const result = await pool.query`SELECT * FROM wallet_balance WHERE id = ${id}`;

        if (result.rowsAffected) {
            return result.recordset[0];
        }

        return null;
    }

    public async findByUserAndCode(userId: number): Promise<Balance | null> {
        const pool = await connector;
        const result = await pool.query`SELECT * FROM wallet_balance WHERE user_id = ${userId}`;

        if (result.rowsAffected) {
            return result.recordset[0];
        }

        return null;
    }

    public async all(): Promise<Balance[]> {
        const pool = await connector;
        const result = await pool.query`SELECT * FROM wallet_balance ORDER BY id DESC`;

        return result.recordset;
    }

    public async store(entry: Balance): Promise<void> {
        const pool = await connector;
        const now = new Date();

        entry.created_at = now;

        await pool.query
            `INSERT INTO wallet_balance(user_id, amount, created_at)
             VALUES(${entry.user_id}, ${entry.amount}, ${entry.created_at})`;
    }

    public async update(entry: Balance): Promise<void> {
        const pool = await connector;
        const now = new Date();

        entry.updated_at = now;

        await pool.query
            `UPDATE wallet_balance
             SET user_id = ${entry.user_id},
                 amount = ${entry.amount},
                 updated_at = ${entry.updated_at}
             WHERE id = ${entry.id}`;
    }

    public async remove(id: number): Promise<void> {
        const pool = await connector;

        await pool.query`DELETE FROM wallet_balance WHERE id = ${id}`;
    }
}
~~~

- mssql/subscription.repository

~~~js
import connector from "../../../../common/persistence/mssql.persistence";
import { Subscription } from "../../domain/subscription";
import { SubscriptionRepository } from "../../subscription.repository";

export class SubscriptionMSSQLRepository implements SubscriptionRepository {
    public async find(id: number): Promise<Subscription | null> {
        const pool = await connector;
        const result = await pool.query`SELECT * FROM wallet_subscription WHERE id = ${id}`;

        if (result.rowsAffected) {
            return result.recordset[0];
        }

        return null;
    }

    public async findByUserAndCode(userId: number, code: string): Promise<Subscription | null> {
        const pool = await connector;
        const result = await pool.query`SELECT * FROM wallet_subscription WHERE user_id = ${userId} AND code ${code}`;

        if (result.rowsAffected) {
            return result.recordset[0];
        }

        return null;
    }

    public async all(): Promise<Subscription[]> {
        const pool = await connector;
        const result = await pool.query`SELECT * FROM wallet_subscription ORDER BY id DESC`;

        return result.recordset;
    }

    public async store(entry: Subscription): Promise<void> {
        const pool = await connector;
        const now = new Date();

        entry.created_at = now;

        await pool.query
            `INSERT INTO wallet_subscription(user_id, code, amount, cron, created_at)
             VALUES(${entry.user_id}, ${entry.code}, ${entry.amount}, ${entry.cron}, ${entry.created_at})`;
    }

    public async update(entry: Subscription): Promise<void> {
        const pool = await connector;
        const now = new Date();

        entry.updated_at = now;

        await pool.query
            `UPDATE wallet_subscription
             SET user_id = ${entry.user_id},
                 code = ${entry.code},
                 amount = ${entry.amount},
                 cron = ${entry.cron},
                 updated_at = ${entry.updated_at}
             WHERE id = ${entry.id}`;
    }

    public async remove(id: number): Promise<void> {
        const pool = await connector;

        await pool.query`DELETE FROM wallet_subscription WHERE id = ${id}`;
    }
}
~~~
-----

## De MySQL a MSSQL sin afectar el código

- Lo único que hay que cambiar es la dependencia en el container, nada más!
- container.ts

~~~js
import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
/*import { SubscriptionMySQLRepository } from './services/repositories/impl/mysql/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { MovementMySQLRepository } from './services/repositories/impl/mysql/movement.repository';
import { BalanceMySQLRepository } from './services/repositories/impl/mysql/balance.repository';*/
import { MovementService } from './services/movement.service';
import { SubscriptionMSSQLRepository } from './services/repositories/impl/mssql/subscription.repository';
import { MovementMSSQLRepository } from './services/repositories/impl/mssql/movement.repository';
import { BalanceMSSQLRepository } from './services/repositories/impl/mssql/balance.repository';


export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
   
    container.register({
        //repositories
        /*subscriptionRepository: asClass(SubscriptionMySQLRepository).scoped(),
        movementRepository: asClass(MovementMySQLRepository).scoped(),
        balanceRepository: asClass(BalanceMySQLRepository).scoped(), */
        subscriptionRepository: asClass(SubscriptionMSSQLRepository).scoped(),
        movementRepository: asClass(MovementMSSQLRepository).scoped(),
        balanceRepository: asClass(BalanceMSSQLRepository).scoped(),

        //services
        testService: asClass(TestService).scoped(),
        subscriptionService: asClass(SubscriptionService).scoped(),
        movementService: asClass(MovementService).scoped()

    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}
~~~

- De esta manera hemos reducido el acoplamiento y favorecido la colaboración entre clases a través de los repositorios

