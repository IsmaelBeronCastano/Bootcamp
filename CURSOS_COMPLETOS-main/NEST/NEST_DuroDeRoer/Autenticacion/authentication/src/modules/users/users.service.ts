import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<IUser>
  ){
    this.populateUsers()
  }

  async populateUsers(){
    const users: CreateUserDto[]= [
      {
        email: "paquita@gmail.com",
        password: "123456"
      },
      {
        email: "jordi@gmail.com",
        password: "123456"
      },
      {
        email: "leonardo@gmail.com",
        password: "123456"
      }
    ]

    for (const user of users){
      const userExists = await this.findUserByEmail(user.email)
      if(!userExists){
        await this.createUser(user)      
      }
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const userExists = await this.findUserByEmail(createUserDto.email)

    if(userExists){
      throw new ConflictException("El usuario ya existe")
    }
    const user = new this.userModel(createUserDto)

    await user.save()

    user.password = undefined

    return user
  }

  getUsers() {
    return this.userModel.find({}, {password:0});
  }

  async findUserByEmail(email: string){
    return await this.userModel.findOne({email: email.toLowerCase()})
  }

}
