import { Request, Response } from "express"
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto"
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto"
import { TodoRepository } from "../../domain/repositories/todo.repo"
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, UpdateTodo } from "../../domain/use-cases"





export class TodosController{
    
        constructor(
            private readonly todoRepository: TodoRepository
        ){
           
        }

       public getTodos=(req: Request, res: Response)=>{
            new GetTodos(this.todoRepository)
                .execute()
                .then(todos=> res.json(todos))
                .catch(error=> res.status(400).json({error}))
        }

    public todoById=(req: Request, res: Response)=>{
        const id = +req.params.id
        new GetTodo(this.todoRepository)
        .execute(id)
        .then(todo=> res.json(todo))
        .catch(error=> res.status(400).json({error}))
      
    }

    public createTodo=(req:Request, res:Response)=>{ 
        const [error, createTodoDto] = CreateTodoDto.create(req.body)
        if(error) return res.status(400).json({error})
            new CreateTodo(this.todoRepository)
            .execute(createTodoDto!) //aqui no puede ser undefined
            .then(todo=> res.json(todo))
            .catch(error=> res.status(400).json({error}))   
    }

    public updateTodo = ( req: Request, res: Response ) => {
        const id = +req.params.id
        const [error,updateTodoDto] = UpdateTodoDto.create({...req.body, id})
        if(error) return res.status(400).json({error})
        new UpdateTodo(this.todoRepository)
        .execute(updateTodoDto!)
        .then(todo=> res.json(todo))
        .catch(error=> res.status(400).json({error}))
      }
    

    public deleteTodoById=(req:Request, res:Response)=>{
        const id = +req.params.id
        new DeleteTodo(this.todoRepository)
        .execute(id)
        .then(todo=> res.json(todo))
        .catch(error=>res.status(400).json({error}))
    }
}

