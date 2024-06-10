import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsPositive, IsNotEmpty, IsBoolean, IsOptional } from "class-validator"

export class CreateProductDto {

    @ApiProperty({
        name: "id",
        required: false,
        description: "id del producto",
        type: Number
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    id?: number
    
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    stock!: number
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price!: number

    @IsOptional()
    @IsBoolean()
    deleted?: boolean
}

