import { regularExps } from "../../../config/regular-exp";

export class RegisterUserDto{
    constructor(
        public name: string,
        public email: string,
        public password: string,
         
    ){}

    static create(object:{[key:string]: any}): [string?, RegisterUserDto?]{
        const {name, email, password, emailValidated} = object;
        if(!name || !email || !password){
            return ['Invalid input', undefined];
        }

        if(!regularExps.email.test(email)) return ['Invalid email', undefined]
        if(password.length < 6) return ['Password must be at least 6 characters', undefined]
        
        return [undefined, new RegisterUserDto(name, email, password)];

    }
}