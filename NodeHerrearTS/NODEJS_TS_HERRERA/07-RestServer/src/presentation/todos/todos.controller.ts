import { Request, Response } from "express"

interface Todo {
    id: number
    title: string
    completed: boolean
}
const todos : Todo[] = [
    { id: 1, title: "Todo 1", completed: false },
    { id: 2, title: "Todo 2", completed: true },
    { id: 3, title: "Todo 3", completed: false }
]


export class TodosController{
    
    constructor(){

    }

    public getTodos(req: Request, res: Response){
        res.json(todos)
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

    public createTodo(req:Request, res:Response){ 
        const {id, title, completed} = req.body

        res.json({id,title, completed})

    }

    public updateTodoById(req:Request, res:Response){
        const id = +req.params.id
        const {title, completed} = req.body

        if(isNaN(id)) return res.status(400).json({error: "Invalid ID"})

        const todo: Todo | undefined = todos.find(todo => todo.id === id)
        if(!todo) return res.status(404).json({error: "Todo not found"})

        if (todo) {
            todo.title = title
            todo.completed = completed
            res.json(todo)
        } else {
            res.json({ error: "Todo not found" })
        }
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