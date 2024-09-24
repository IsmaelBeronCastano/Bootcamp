
export interface IUser{
    _id?: string
    name: string | undefined,
    email: string | undefined,
    password: string | undefined
    createdAt?: Date | undefined,
    updatedAt?: Date | undefined
}