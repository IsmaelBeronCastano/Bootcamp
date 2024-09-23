import { winstonLogger } from '@users/helpers/logger'
import {config} from '../config'
import mongoose from 'mongoose'
import {Logger} from 'winston'

const log: Logger = winstonLogger('users', 'debug')

const connectionDB = async(): Promise<void>=>{

    try {
        await mongoose.connect(`${config.DATABASE_URL}`)    
        log.log("Users database connected!", "OK")
    } catch (error) {
     log.log("Users database not connected!", error)   
    }

} 

export {connectionDB}