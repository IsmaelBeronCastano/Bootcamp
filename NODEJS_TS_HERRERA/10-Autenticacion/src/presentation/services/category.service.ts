import { CategoryModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CategoryDto } from "../../domain/dtos/auth/categories/category.dto";
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
}