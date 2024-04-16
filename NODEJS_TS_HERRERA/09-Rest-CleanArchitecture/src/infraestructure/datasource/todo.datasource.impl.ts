import { prisma } from "../../data/postgres";
import { TodoDataSource } from "../../domain/datasources/todo.datasources";
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";

export class TodoDatasourceImpl implements TodoDataSource{
    
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto
        })

        return  TodoEntity.formJson(todo)

    }

    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id)
        
        const deleted = await prisma.todo.delete({
            where: {id}
        })

        return TodoEntity.formJson(deleted)
    }

    async getAll(): Promise<TodoEntity[]> {
        const todos= await prisma.todo.findMany()

        return todos.map(todo=> TodoEntity.formJson(todo))
    }

    async findById(id: number): Promise<TodoEntity> {
       const todo = await prisma.todo.findFirst({
        where: {id}
       })

       if(!todo) throw `todo with id ${id} notfound`

       return TodoEntity.formJson(todo)
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        const todo = await this.findById(updateTodoDto.id)
        const updatedTodo = await prisma.todo.update({
            where:{id:updateTodoDto.id},
            data: updateTodoDto.values
        })

        return TodoEntity.formJson(updatedTodo)
    }
}