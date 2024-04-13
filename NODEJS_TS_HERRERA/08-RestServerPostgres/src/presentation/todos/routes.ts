import { Router } from "express";
import { TodosController } from "./todos.controller";

export class TodoRoutes{
    
    
    static get routes():Router{
        const router = Router();
        const todosController = new TodosController();

        router.get('/', todosController.getTodos) //solo mandamos la referencia a la función
        router.get('/:id', todosController.todoById) //solo mandamos la referencia a la función
        router.post('/', todosController.createTodo) 
        router.put('/:id', todosController.updateTodo) 
        return router
    }
}