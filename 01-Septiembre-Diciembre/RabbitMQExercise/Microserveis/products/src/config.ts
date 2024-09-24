import dotenv from 'dotenv'

dotenv.config()

class Config{

    public PORT: string | undefined
    public RABBITMQ_ENDPOINT: string | undefined
    public MYSQL_DB: string | undefined
    
    constructor(){
        this.PORT = process.env.PORT || '',
        this.RABBITMQ_ENDPOINT= process.env.RABBITMQ_ENDPOINT || ''
        this.MYSQL_DB= process.env. MYSQL_DB || ''
    }
}

export const config = new Config()