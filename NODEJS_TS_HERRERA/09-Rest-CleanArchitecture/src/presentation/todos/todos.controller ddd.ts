import { Request, Response } from "express"
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto"
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto"
import { TodoRepository } from "../../domain/repositories/todo.repo"





export class TodosController{
    
        constructor(
            private readonly todoRepository: TodoRepository
        ){
           
        }

       public getTodos= async(req: Request, res: Response)=>{
            const todos= await this.todoRepository.getAll()
            
            return res.json(todos)
        }

    public async todoById(req: Request, res: Response){
        //const id = +req.params.id
        try{
            const todo = await this.todoRepository.findById(Number(req.params.id))
            return res.json(todo)
        }catch(error){
            res.status(400).json({error})
        }
    }

    public async createTodo(req:Request, res:Response){ 
        const [error, createTodoDto] = CreateTodoDto.create(req.body)
        if(error) return res.status(400).json({error})
        const todo= await this.todoRepository.create(createTodoDto!)
        return res.json(todo)

    }

    public updateTodo = async( req: Request, res: Response ) => {
        const [error,updateTodoDto] = UpdateTodoDto.create(req.body)
        if(error) return res.status(400).json({error})
        const updatedTodo= await this.todoRepository.updateById(updateTodoDto!)
        return res.json(updatedTodo)
      }
    

    public deleteTodoById(req:Request, res:Response){
        return this.todoRepository.deleteById(Number(req.params.id))
    }
}