import { CreateTodoDto } from "../dtos/todos/todo.dto";
import { UpdateTodoDto } from "../dtos/todos/update.dto";
import { TodoEntity } from "../entities/todo.entity";

export abstract class TodoRepository{
    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>

    //todo:paginación
    abstract getAll(): Promise<TodoEntity[]>

    abstract findById(id: number): Promise<TodoEntity | null>
   
    abstract updateById(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity | null>

    abstract deleteById(id: number): Promise<TodoEntity | null>
}