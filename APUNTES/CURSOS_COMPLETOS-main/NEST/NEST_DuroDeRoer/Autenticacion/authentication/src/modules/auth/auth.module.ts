import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategyService } from './strategy/jwt-strategy/jwt-strategy.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[PassportModule.register({defaultStrategy: "jwt"}),
  JwtModule.registerAsync({
    useFactory:(configService: ConfigService )=>{
      return {
        secret: configService.get('auth.secretkey'),
        signOptions: {expiresIn: '1h'}
      }
    },
    inject: [ConfigService]
  }),
  UsersModule
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService]
})
export class AuthModule {}
