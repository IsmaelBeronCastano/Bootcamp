import { config } from "../config";
import { winstonLogger } from "../helpers/logger";
import client, { Channel, Connection } from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger("users-ms", "debug")

export async function createConnection (): Promise<Channel | undefined>{
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`)  
        const channel: Channel = await connection.createChannel() 
        log.log("Connection from users created OK!", "Connection from users created OK!")
        closeConnection(channel, connection)
        return channel
    } catch (error) {
        log.info("connection RMQ failed in users-ms", error)
    }
     
}

function closeConnection(channel: Channel, connection: Connection){
    process.once('SIGINT', async ()=>{
        await channel.close()
        await connection.close()
    })
}