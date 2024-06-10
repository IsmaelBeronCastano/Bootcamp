import { Injectable } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';
import{ ConfigService} from '@nestjs/config'


@Injectable()
export class MongoConnectionService {


    private dbConnection: Connection

    constructor( private configService: ConfigService){
        this.createConnectionDB()
    }

     createConnectionDB(){
            const host = this.configService.get('mongo.host')
            const port = this.configService.get('mongo.port')
            const user = this.configService.get('mongo.user')
            const password = this.configService.get('mongo.password')
            const database = this.configService.get('mongo.database')

        const DB_URI = `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin
        this.dbConnection = await createConnection(DB_URI)`

        this.dbConnection = createConnection(DB_URI)
        
        this.dbConnection.once('open', ()=>{
            console.log(`Connected to ${database}!!`)
        })

        this.dbConnection.once('error', ()=>{
            console.log(`Error connecting to ${database}!!`)
        })
    
    
    }

    //para poder inyectarlo en el modulo que yo quiera
    getConnection(){
        return this.dbConnection
    }

    
}
