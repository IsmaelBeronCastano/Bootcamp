import { prisma } from "../../data/postgres";
import { TodoDataSource } from "../../domain/datasources/todo.datasources";
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";
import { TodoRepository } from "../../domain/repositories/todo.repo";


export class TodoRepositoryImpl implements TodoRepository{

    constructor(
        private readonly todoDatasource: TodoDataSource
    ){}


    create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        return this.todoDatasource.create(createTodoDto);
    }

    deleteById(id: number): Promise<TodoEntity> {
        return this.todoDatasource.deleteById(id)
    }

    getAll(): Promise<TodoEntity[]> {
        return this.todoDatasource.getAll()
    }

    findById(id: number): Promise<TodoEntity> {
        return this.todoDatasource.findById(id)
    }
    
    updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        return this.todoDatasource.updateById(updateTodoDto)
    }
}