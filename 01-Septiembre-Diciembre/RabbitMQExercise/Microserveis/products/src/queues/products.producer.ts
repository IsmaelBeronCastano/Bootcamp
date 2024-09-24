import { Channel } from "amqplib";
import { winstonLogger } from "../helpers/logger"
import { Logger } from "winston";
import { createConnection } from "./connection";

const log: Logger = winstonLogger('products producer', 'debug')

const publishDirectMessage =async (

    channel: Channel,
    exchangeName: string,
    routingKey: string,
    message: string,
    logMessage: string
): Promise<void>=>{

    try {
        if(!channel){

            channel= await createConnection() as Channel
        }
        
        await channel.assertExchange(exchangeName, 'direct')
        channel.publish(exchangeName, routingKey, Buffer.from(message))
        log.info(logMessage)
        
    } catch (error) {
        log.log("Error in pproducts.producer", error)
    }

}

export {publishDirectMessage}