import { UserModel } from "@users/models/users.model";
import { IUser } from "../interfaces/user.interface";

export const createUserService = async ({name, email, password}: IUser)=>{

    const user = await UserModel.create({name, email, password})

    await user.save()

    return user
}