import { Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/login')
  @ApiOperation({
    description: "Nos loguea en la app",
  })
  @ApiBody({
    description: "Nos logueamos usando las credenciales",
    type: AuthCredentialsDto,
    examples:{
      ejemplo:{
        value:{
          email: "pedro@gmail.com",
          password: "123456"  
        }
      }
    }
  })
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas"
  })
  @ApiResponse({
    status: 201,
    description: "Login correcto"
  })
  login(@Body() authCredentials: AuthCredentialsDto){
      return this.authService.login(authCredentials)
  }

  @Get('/data-user')
  @UseGuards(AuthGuard('jwt'))
  dataUser(@Request() req){

    console.log(req)
      return req.user
  }
}
