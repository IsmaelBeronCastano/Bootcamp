import { Router } from "express";
import { TodosController } from "./todos.controller";
import { TodoRepositoryImpl } from "../../infraestructure/repositories/todo.repo.impl";
import { TodoDatasourceImpl } from "../../infraestructure/datasource/todo.datasource.impl";

export class TodoRoutes{
    
    
    static get routes():Router{
        const router = Router();

        const todoDatasource = new TodoDatasourceImpl()
        const todoRepository = new TodoRepositoryImpl(todoDatasource)
        const todosController = new TodosController(todoRepository) //necesito proveer el repositorio
      

    

        router.get('/', todosController.getTodos) //solo mandamos la referencia a la función
        router.get('/:id', todosController.todoById) //solo mandamos la referencia a la función
        router.post('/', todosController.createTodo) 
        router.put('/:id', todosController.updateTodo) 
        return router
    }
}