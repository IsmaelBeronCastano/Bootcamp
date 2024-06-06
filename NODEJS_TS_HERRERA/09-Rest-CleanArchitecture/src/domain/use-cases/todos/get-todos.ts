import { CreateTodoDto } from "../../dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../dtos/todos/update.dto";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repo";

export interface GetTodosUseCase{
    execute(): Promise<TodoEntity[]>
}

export class GetTodos implements GetTodosUseCase{

    constructor(
        private readonly repository:TodoRepository
    ){}

    public execute(){
        return this.repository.getAll()
    }
}
