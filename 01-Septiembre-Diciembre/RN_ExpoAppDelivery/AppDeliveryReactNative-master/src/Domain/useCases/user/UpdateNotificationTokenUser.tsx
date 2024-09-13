import { UserRepositoryImpl } from "../../../Data/repositories/UserRepository";
import { User } from "../../entities/User";

const { updateNotificationToken } = new UserRepositoryImpl();

export const UpdateNotificationTokenUserUseCase = async(id: string, token: string) => {
    return await updateNotificationToken(id, token);
}