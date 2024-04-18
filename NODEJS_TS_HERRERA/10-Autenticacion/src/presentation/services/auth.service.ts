import { UserModel } from "../../data";
import { CustomError } from "../../domain";
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
            await user.save();

            const {password, ...rest} = UserEntity.fromObject(user)
            return {user: rest, token: 'ABC'}
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

        
    }
}