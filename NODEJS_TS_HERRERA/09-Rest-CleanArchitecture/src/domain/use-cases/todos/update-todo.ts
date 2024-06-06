import { CreateTodoDto } from "../../dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../dtos/todos/update.dto";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repo";

export interface UpdateTodoUseCase{
    execute(dto:UpdateTodoDto): Promise<TodoEntity>
}

export class UpdateTodo implements UpdateTodoUseCase{

    constructor(
        private readonly repository:TodoRepository
    ){}

    public execute(dto:UpdateTodoDto){
        return this.repository.updateById(dto)
    }
}
