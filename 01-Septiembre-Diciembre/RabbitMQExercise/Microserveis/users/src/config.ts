import dotenv from 'dotenv'


dotenv.config()

class Config{

    public PORT: string | undefined

    constructor(){
        this.PORT = process.env.PORT || ''
    }
}

export const config = new Config()