import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurationMongo from './configuration/configuration-mongo';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import configurationAuth from './configuration/configuration-auth';
require('dotenv').config(); 

@Module({
  imports: [ConfigModule.forRoot({
    load: [configurationMongo, configurationAuth],
    envFilePath: `./env/${process.env.NODE_ENV}.env`,
    isGlobal: true
  }),
  UsersModule, 
  AuthModule   
],
  controllers: [],
  providers: [],
})
export class AppModule {}
