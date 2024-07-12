import express from 'express'
import { TestService } from "./services/test.service";
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { SubscriptionMySQLRepository } from './services/repositories/impl/mysql/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { MovementMySQLRepository } from './services/repositories/impl/mysql/movement.repository';
import { MovementService } from './services/movement.service';
import { BalanceMySQLRepository } from './services/repositories/impl/mysql/balance.repository';
/*import { SubscriptionMSSQLRepository } from './services/repositories/impl/mssql/subscription.repository';
import { MovementMSSQLRepository } from './services/repositories/impl/mssql/movement.repository';
import { BalanceMSSQLRepository } from './services/repositories/impl/mssql/balance.repository';
*/

export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
   
    container.register({
        //repositories
        subscriptionRepository: asClass(SubscriptionMySQLRepository).scoped(),
        movementRepository: asClass(MovementMySQLRepository).scoped(),
        balanceRepository: asClass(BalanceMySQLRepository).scoped(), 
        /*subscriptionRepository: asClass(SubscriptionMSSQLRepository).scoped(),
        movementRepository: asClass(MovementMSSQLRepository).scoped(),
        balanceRepository: asClass(BalanceMSSQLRepository).scoped(),*/

        //services
        testService: asClass(TestService).scoped(),
        subscriptionService: asClass(SubscriptionService).scoped(),
        movementService: asClass(MovementService).scoped()

    })

    //Asocio el contenedor a express
    app.use(scopePerRequest(container))

}