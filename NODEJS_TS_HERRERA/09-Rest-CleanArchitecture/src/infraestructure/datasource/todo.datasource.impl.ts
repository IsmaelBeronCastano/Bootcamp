import { prisma } from "../../data/postgres";
import { TodoDataSource } from "../../domain/datasources/todo.datasources";
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";

export class TodoDatasourceImpl implements TodoDataSource{
    create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        throw new Error("Method not implemented.");
    }
    deleteById(id: number): Promise<TodoEntity> {
        throw new Error("Method not implemented.");
    }
    async getAll(): Promise<TodoEntity[]> {
        const todos= await prisma.todo.findMany()

        return todos.map(todo=> TodoEntity.formJson(todo))
    }
    findById(id: number): Promise<TodoEntity> {
        throw new Error("Method not implemented.");
    }
    updateById(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        throw new Error("Method not implemented.");
    }
}