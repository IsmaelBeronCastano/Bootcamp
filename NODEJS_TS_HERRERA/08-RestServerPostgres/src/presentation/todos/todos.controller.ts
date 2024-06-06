import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto"
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto"

interface Todo {
    id: number
    title: string
    completedAt: Date | null
}
const todos : Todo[] = [
    { id: 1, title: "Todo 1", completedAt: null },
    { id: 2, title: "Todo 2", completedAt: null },
    { id: 3, title: "Todo 3", completedAt: null }
]


export class TodosController{
    
    constructor(){

    }

   public async getTodos(req: Request, res: Response){
        const todos= await prisma.todo.findMany()

        return res.json(todos)
    }

    public todoById(req: Request, res: Response){
        const id = +req.params.id

        if(isNaN(id)) return res.status(400).json({error: "Invalid ID"})

        const todo: Todo | undefined = todos.find(todo => todo.id === id)
        
        if (todo) {
            res.json(todo)
        } else {
            res.json({ error: "Todo not found" })
        }
    }

    public async createTodo(req:Request, res:Response){ 

        const createTodoDto= CreateTodoDto.create(req.body)
        if(createTodoDto[0]) return res.status(400).json({error: createTodoDto[0]})
            
        const {text} = req.body
        
        if(!text) return res.status(400).json({error: "Text is required"})
        
            const newTodo= await prisma.todo.create({
            data: {
                text
            }
        
        })

        res.json(newTodo)

    }

    public updateTodo = async( req: Request, res: Response ) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if ( error ) return res.status(400).json({ error });
        
        const todo = await prisma.todo.findFirst({
          where: { id }
        });
    
        if ( !todo ) return res.status( 404 ).json( { error: `Todo with id ${ id } not found` } );
    
        const updatedTodo = await prisma.todo.update({
          where: { id },
          data: updateTodoDto!.values
        });
      
        res.json( updatedTodo );
    
      }
    

    public deleteTodoById(req:Request, res:Response){
        const id = +req.params.id

        if(isNaN(id)) return res.status(400).json({error: "Invalid ID"})

        const index = todos.findIndex(todo => todo.id === id)
        if(index === -1) return res.status(404).json({error: "Todo not found"})

        todos.splice(index, 1)
        res.json({message: "Todo deleted"})
    }
}