import dotenv from 'dotenv'

dotenv.config()

class Config{

    public PORT: string | undefined
    public RABBITMQ_ENDPOINT: string | undefined
    
    constructor(){
        this.PORT = process.env.PORT || '',
        this.RABBITMQ_ENDPOINT= process.env.RABBITMQ_ENDPOINT

    }
}

export const config = new Config()