import { CategoryModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CategoryDto } from "../../domain/dtos/auth/categories/category.dto";
import { PaginationDto } from "../../domain/dtos/auth/categories/pagination.dto";
import { UserEntity } from "../../domain/entities/user/user.entity";

export class CategoryService{


    constructor(){}

    async createCategory(categoryDto:CategoryDto, user:UserEntity){
        const categoryExists = await CategoryModel.findOne({name: categoryDto.name})
        if(categoryExists) throw CustomError.badRequest("Category exists")

            try {
                const category= new CategoryModel({
                    ...categoryDto,
                    user: user.id
                })

                await category.save()

                return {
                    id: category.id,
                    name: category.name,
                    available: category.available
                }
                
            } catch (error) {
                throw CustomError.internalServer(`${error}`)
            }
    }

    async getCategories(paginationDto:PaginationDto){
        
        const {page, limit} = paginationDto

        try {

            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                .skip((page-1) * limit)
                .limit(limit)
            ])
          
            return{
                page,
                limit,
                total,
                next: (page-1 >0)?`/api/v1/categories?page=${page+1}&limit=${limit}`:null,
                prev: `/api/v1/categories?page=${page-1}&limit=${limit}`,

                categories: categories.map(category=>({
                    
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))    
            }

            
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }
}