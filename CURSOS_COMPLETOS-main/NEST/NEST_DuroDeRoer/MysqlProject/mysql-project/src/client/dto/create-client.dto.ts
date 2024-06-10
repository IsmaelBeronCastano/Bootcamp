import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Address } from "../entities/address.entity";
import { Type } from "class-transformer";


export class CreateClientDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    id?: number

    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @Type(()=> Address)
    @IsNotEmpty()
    address: Address

}
