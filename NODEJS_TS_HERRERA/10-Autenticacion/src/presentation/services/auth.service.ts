import { Request, Response } from "express";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user/user.entity";

export class AuthService{
    constructor(){

    }

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('User already exists');

        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password) //encripto el password antes de guardar

            await user.save();

            const {password, ...userEntity}= UserEntity.fromObject(user)
            return {user: userEntity, token: 'ABC'}
            
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

        return {
            user: userEntity,
            token: 'ABC'
        }
    }
}