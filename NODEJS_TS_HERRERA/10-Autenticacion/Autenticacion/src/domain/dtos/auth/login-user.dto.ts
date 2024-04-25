import { regularExps } from "../../../config/regular-exp"




export class LoginUserDto{
    constructor(
        public readonly email: string,
        public readonly password: string
    ){}

    static create(object:{[key:string]:any}):[string?, LoginUserDto?] {
        const {email, password} = object

        if(!email) return ['Email is required', undefined]
        if(!regularExps.email.test(email)) return ['Invalid email', undefined]
        if(!password) return ['Password is required', undefined]
        if(password.length >6) return ['Password too short']

        return [undefined, new LoginUserDto(email, password)]
    }
}