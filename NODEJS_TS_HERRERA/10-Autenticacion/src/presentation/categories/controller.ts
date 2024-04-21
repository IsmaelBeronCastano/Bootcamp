import { Request, Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { CategoryDto } from "../../domain/dtos/auth/categories/category.dto";
import { CustomError } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController{

    constructor(
        private readonly categoryService: CategoryService
        
    ){}

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }

    public getCategories(){

    }

    public createCategory=(req:Request, res: Response)=>{
        const [error, categoryDto] = CategoryDto.create(req.body)
        if(error) return res.status(400).json({error})

        this.categoryService.createCategory(categoryDto!, req.body.user)
            .then(category =>res.json(category))
            .catch(error=>res.json(`${error}`))
    }

    
}