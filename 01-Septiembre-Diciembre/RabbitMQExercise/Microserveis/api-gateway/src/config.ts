import dotenv from 'dotenv'

dotenv.config()

class Config{
    
    public PORT: string | undefined
    public JWT_GATEWAY : string | undefined
    public PRODUCTS_BASE_URL: string | undefined

    constructor(){
        this.PORT = process.env.PORT || ''
        this.JWT_GATEWAY = process.env.JWT_GATEWAY || ''
        this.PRODUCTS_BASE_URL= process.env.PRODUCTS_BASE_URL || ''
    }
}

export const config = new Config()