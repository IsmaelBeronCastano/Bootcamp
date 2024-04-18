import { Request, Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";

export class AuthController{

    constructor(
        public readonly authService: AuthService
    ){

    }

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }

    registerUser=(req:Request,res:Response)=>{
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if(error) return res.status(400).json({error});

        this.authService.registerUser(registerUserDto!)
            .then((user)=>res.json(user))
            .catch((error)=>this.handleError(error, res))
        
    }
    
    loginUser=(req:Request,res:Response)=>{
        res.json('loginUser')
    }
    
    validateEmail=(req:Request,res:Response)=>{
        res.json('validateEmail')
    }
}