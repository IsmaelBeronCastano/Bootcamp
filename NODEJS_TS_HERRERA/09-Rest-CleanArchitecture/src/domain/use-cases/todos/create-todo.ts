import { CreateTodoDto } from "../../dtos/todos/todo.dto";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repo";

export interface CreateTodoUseCase{
    execute(dto:CreateTodoDto): Promise<TodoEntity>
}

export class CreateTodo implements CreateTodoUseCase{

    constructor(
        private readonly repository:TodoRepository
    ){}

    public execute(dto: CreateTodoDto){
        return this.repository.create(dto)
    }
}