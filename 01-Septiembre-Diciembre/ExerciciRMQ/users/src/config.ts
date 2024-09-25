import dotenv from 'dotenv'

dotenv.config({})

class Config{

    public PORT: string | undefined
    public DATABASE_URL: string | undefined

    constructor(){
        this.PORT = process.env.PORT || '',
        this.DATABASE_URL = process.env.DATABASE_URL || ''
    }
}

export const config: Config = new Config()
