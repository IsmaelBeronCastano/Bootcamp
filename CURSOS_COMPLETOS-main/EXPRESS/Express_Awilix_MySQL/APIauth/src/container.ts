import express from 'express'
import {createContainer, asClass} from 'awilix'
import { scopePerRequest } from 'awilix-express';
import { IdentityService } from './services/identity.service';

export default (app: express.Application)=>{
    
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })
    
   
    container.register({
    identityService: asClass(IdentityService).scoped()

    })

   
    app.use(scopePerRequest(container))

}