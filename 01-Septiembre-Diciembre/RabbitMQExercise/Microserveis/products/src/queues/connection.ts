import { winstonLogger } from "@users/helpers/logger"
import client, { Channel, Connection } from "amqplib"
import { Logger } from "winston"
import {config} from '../config'

const log: Logger = winstonLogger('products logger', 'debug')


async function createConnection(): Promise<Channel | undefined>{
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`)
        const channel: Channel = await connection.createChannel()
        log.info("Products  rabbitMQ connection done!", "rabbitMQ connection OK!")
        closeConnection(channel, connection)
        return channel
        
    } catch (error) {
        log.log("Products RabbitMQ connection failed!", error)
    }
}

function closeConnection(channel: Channel, connection: Connection): void{
    process.once('SIGINT', async ()=>{
        await channel.close()
        await connection.close()
    })
}

export {createConnection}