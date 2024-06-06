import { CreateTodoDto } from "../../dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../dtos/todos/update.dto";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repo";

export interface GetTodoUseCase{
    execute(id:number): Promise<TodoEntity>
}

export class GetTodo implements GetTodoUseCase{

    constructor(
        private readonly repository:TodoRepository
    ){}

    public execute(id:number){
        return this.repository.findById(id)
    }
}
