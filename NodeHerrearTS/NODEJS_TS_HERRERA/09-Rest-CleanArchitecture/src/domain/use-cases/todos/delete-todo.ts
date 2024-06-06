import { CreateTodoDto } from "../../dtos/todos/todo.dto";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repo";

export interface DeleteTodoUseCase{
    execute(id:number): Promise<TodoEntity>
}

export class DeleteTodo implements DeleteTodoUseCase{

    constructor(
        private readonly repository:TodoRepository
    ){}

    public execute(id:number){
        return this.repository.deleteById(id)
    }
}
