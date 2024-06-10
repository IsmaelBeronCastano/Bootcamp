import {registerAs} from '@nestjs/config' 

export default registerAs('auth', ()=>({
    secretkey: process.env.SECRETKEY_AUTH
}))