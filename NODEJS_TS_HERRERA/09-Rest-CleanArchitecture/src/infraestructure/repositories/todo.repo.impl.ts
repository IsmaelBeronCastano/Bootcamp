import { prisma } from "../../data/postgres";
import { TodoDataSource } from "../../domain/datasources/todo.datasources";
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";
import { TodoDatasourceImpl } from "../datasource/todo.datasource.impl";

export class TodoRepositoryImpl implements TodoDataSource{

    constructor(
        private readonly datasource: TodoDataSource
    ){}


    create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        return this.datasource.create(createTodoDto);
    }

    deleteById(id: number): Promise<TodoEntity | null> {
        return this.datasource.deleteById(id)
    }

    async getAll(): Promise<TodoEntity[]> {
        return this.datasource.getAll()
    }

    findById(id: number): Promise<TodoEntity | null> {
        return this.datasource.findById(id)
    }
    
    updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity | null> {
        return this.datasource.updateById(updateTodoDto)
    }
}