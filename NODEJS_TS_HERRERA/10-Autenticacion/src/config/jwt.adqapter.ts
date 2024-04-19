import jwt from 'jsonwebtoken'
import { envs } from './envs'

const JWT_SEED = envs.JWT_SEED


export class JwtAdapter{

    
   static async generateToken(payload:any, duration:string= '2h', seed= JWT_SEED){

    return new Promise(resolve=>{

        jwt.sign(payload, seed, {expiresIn: duration}, (err, token)=>{
            if(err) return resolve(null)
            
            resolve(token)
        })
    })

0
   }

   static validateToken(token:string){
    return new Promise(resolve=>{
        jwt.verify(token, JWT_SEED, (err, decoded)=>{
            if(err) return resolve(null)
            resolve(decoded)
        })
    })

   }

}