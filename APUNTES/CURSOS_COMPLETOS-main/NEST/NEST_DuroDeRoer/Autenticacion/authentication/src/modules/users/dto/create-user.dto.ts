import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";


export class CreateUserDto {

    @ApiProperty({
        name: 'email',
        type: String,
        required: true,
        description: 'Email del usuario'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        name: 'password',
        type: String,
        required: true,
        description: 'Password del usuario'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}


