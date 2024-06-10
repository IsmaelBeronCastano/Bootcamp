import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './dto/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

  async validateUser(authCredentials: AuthCredentialsDto){
    const user = await this.usersService.findUserByEmail(authCredentials.email)
    if(user){

      const passwordOk = await bcrypt.compare(authCredentials.password, user.password)
      if(passwordOk){
          return user
      }
    }
    return null
  }

  async login(authCredentials: AuthCredentialsDto){
    const user = await this.validateUser(authCredentials)

    if(!user){
      throw new UnauthorizedException("Credenciales inválidas")
    }

    const payload: JwtPayload ={
      email: user.email
    } 

    return {
      accesToken: this.jwtService.sign(payload)
    }
  }
}
