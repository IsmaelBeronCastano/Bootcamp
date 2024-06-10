import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";

@Controller('api/v1/test')
export class TestController{

    @Post()
    create(@Body() body: string){
        //throw new HttpException('Error en la petición', HttpStatus.BAD_REQUEST)

        return new Promise((resolve, reject)=>{
            setTimeout(()=>reject("Algo fue mal"), 15000)
        })
    }

}