import { Request, Response } from "express";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user/user.entity";
import { JwtAdapter } from "../../config/jwt.adqapter";
import { EmailService } from "./email.services";
import { envs } from "../../config/envs";

export class AuthService{
    constructor(
        private readonly emailService: EmailService
    ){

    }

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('User already exists');

        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password) //encripto el password antes de guardar

            await user.save();

            

            await this.sendEmailValidationLink(user.email) //ENVIO EL MAIL DE CONFIRMACIÓN!!

            const {password, ...userEntity}= UserEntity.fromObject(user)
            const token= await  JwtAdapter.generateToken({id: user.id})
            if(!token) throw CustomError.internalServer("Error generating token")
            return {user: userEntity, token: token}
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

        
    }

    public async loginUser(loginUserDto: LoginUserDto){
        const user = await UserModel.findOne({email:loginUserDto.email })

        if(!user) throw CustomError.badRequest("User don't exists!")

        const hashMatch = bcryptAdapter.compare(loginUserDto.password, user.password)

        if(!hashMatch) throw CustomError.unauthorized("Password is not valid")
        
        const {password, ...userEntity} = UserEntity.fromObject(user)

        const token= await  JwtAdapter.generateToken({id: user.id})
        if(!token) throw CustomError.internalServer("Error generating token")

        return {
            user: userEntity,
            token: token
        }
    }

    private sendEmailValidationLink =async(email:string)=>{
        const token = await JwtAdapter.generateToken({email})

        if(!token) throw CustomError.internalServer('Error generating token')

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`

        const html=`
        <h1>Validar Email</h1>
        <p>Este es un correo para validar tu cuenta</p>
        <a href=${link}>Valida tu email: ${email}</a>
        <p>por favor, si no has sido tu ignóralo</p>
        <p>Gracias</p>
        `

        const options= {
            to: email,
            subject: 'Valida tu email',
            htmlBody: html
        }

        const isSent= await this.emailService.sendEmail(options)

        if(!isSent) throw CustomError.internalServer("Error sending email")

        return true
    }  
    
    public validateEmail= async(token:string)=>{
        const payload = await JwtAdapter.validateToken(token);

        if (!payload) throw CustomError.badRequest('Invalid token');

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });

        if (!email) throw CustomError.internalServer('Error getting email');

        if (!user) throw CustomError.internalServer('User not found');

        user.emailValidated = true;

        await user.save()
        return true
    
    }
 
}