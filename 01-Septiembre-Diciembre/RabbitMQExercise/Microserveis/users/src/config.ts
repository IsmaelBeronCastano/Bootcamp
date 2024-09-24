import dotenv from 'dotenv'


dotenv.config()

class Config{

    public PORT: string | undefined
    public DATABASE_URL: string
    public RABBITMQ_ENDPOINT: string | undefined

    constructor(){
        this.PORT = process.env.PORT || '',
        this.DATABASE_URL = process.env.DATABASE_URL || ''
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || ''
    }
}

export const config = new Config()