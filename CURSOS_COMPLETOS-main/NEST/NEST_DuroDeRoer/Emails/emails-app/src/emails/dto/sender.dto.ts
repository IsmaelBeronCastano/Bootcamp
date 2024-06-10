import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SenderDto{
    
    @ApiProperty({
        name: 'email',
        required: true,
        type: String,
        description: "Email del destinatario"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string
}