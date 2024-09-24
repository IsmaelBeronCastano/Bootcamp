import { config } from '../config'
import { winstonLogger } from '@users/helpers/logger'
import {Sequelize} from 'sequelize'
import { Logger } from 'winston'


const log: Logger = winstonLogger("sequelize Database connection", "debug")

export const sequelize = new Sequelize(`${config.MYSQL_DB}`,{
    dialect: 'mysql',
    logging: false,
    dialectOptions:{
        multipleStatements: true
    }
})

export async function databaseConnection(): Promise<void>{
    try {
        await sequelize.authenticate()//esto crea la conexión
        log.log("connection database OK!!", "conexion database OK!")
        
    } catch (error) {
        log.log("databaseConnection sequelize error", error)
    }
}