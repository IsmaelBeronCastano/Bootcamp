import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt'
import { UsersService } from 'src/modules/users/users.service';
import { JwtPayload } from '../../dto/jwt-payload';


@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('auth.secretkey')
        })
    }

   async  validate(payload: JwtPayload){
        const user = await this.usersService.findUserByEmail(payload.email)
        if(!user){
            throw new NotFoundException("El usuario no existe")
        }
        user.password = undefined

        return user;
    }
}
