# Rest Server 2

- Creo presentation/routes.ts

~~~js
import { Router } from "express";

export class AppRoutes{
    
    
    static get routes():Router{
        const router = Router();

        router.get('/api/todos', (req, res) => {  
            res.json([
                { id: 1, title: "Todo 1", completed: false },
                { id: 2, title: "Todo 2", completed: true },
                { id: 3, title: "Todo 3", completed: false }
            ])
        })

        return router
    }
}
~~~

- Este router lo voy a poder mandar como un middleware
- En el Server añado router a la interfaz para pasársela al constructor

~~~js
import express, { Router } from 'express'
import path from 'path'


interface Options{
    PORT : number
    PUBLIC_PATH?: string
    routes: Router //añado routes a la interfaz
}


export class Server {
    private readonly port;
    private readonly publicPath;
    private readonly routes; 

    constructor(options:Options){
        const {PORT, PUBLIC_PATH='public', routes}= options

        this.port = PORT
        this.publicPath = PUBLIC_PATH
        this.routes = routes //declaro routes en el constructor
    }

    private app = express()

    async start(){


        //middlewares

        //Public Folder
        this.app.use(express.static(this.publicPath))


        this.app.use(this.routes) //hago uso de las routes

        this.app.get('*', (req,res)=>{
          const indexPage = path.join(__dirname, `../../${this.publicPath}/index.html`)  
          res.sendFile(indexPage)  
        })
        
        this.app.listen(this.port, ()=>{
            console.log("corriendo en el 3000!")
        })
    }
}
~~~

- En app, en la instancia del server, añado el router y hago uso del metodo estático get
- Los getters no se invocan

~~~js
import { envs } from "./config/env";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async()=>{

    main();
})()


function main (){

    const server = new Server({
        PORT: envs.PORT,
        PUBLIC_PATH: envs.PUBLIC_PATH,
        routes: AppRoutes.routes
    })

    server.start()

}
~~~

- De todas maneras así no se manejan las rutas
- En presentation creo las carpetas todos users y products
- En todos creo controller.ts
- No va a tener métodos estáticos, ya que voy a hacer inyección de dependencias (por lo que necesito el constructor)
- Vamos a inyectar el repositorio para poder usarlo e implementarlo mediante casos de uso

~~~js
import { Request, Response } from "express"

export class TodosController{
    
    constructor(){}

    public getTodos=(req: Request, res: Response) => {  
        res.json([
            { id: 1, title: "Todo 1", completed: false },
            { id: 2, title: "Todo 2", completed: true },
            { id: 3, title: "Todo 3", completed: false }
        ])
    }   
}
~~~

- Si en AppRoutes empiezo a tener endpoints y endpoints puede desordenarse mucho.
- Por ahora agreguemos el TodoController

~~~js
import { Request, Response } from "express"

export class TodosController{
    
    constructor(){

    }

    public getTodos=(req: Request, res: Response) => {  
        res.json([
            { id: 1, title: "Todo 1", completed: false },
            { id: 2, title: "Todo 2", completed: true },
            { id: 3, title: "Todo 3", completed: false }
        ])
    }   
}
~~~

- En todos creo otro archivo de rutas con la misma configuracion que AppRoutes

~~~js
import { Router } from "express";
import { todo } from "node:test";
import { TodosController } from "./todos.controller";

export class TodoRoutes{
    
    
    static get routes():Router{
        const router = Router();
        const todosController = new TodosController();

        router.get('/', todosController.getTodos) //solo mandamos la referencia a la función

        return router
    }
}
~~~

- Este es mi sistema de rutas unicamente relacionado a los todos
- En AppRoutes cambio el app.get por app.use y le paso el TodoRoutes.routes (el metodo estático con las rutas)

~~~js
import { Router } from "express";
import { TodosController } from "./todos/todos.controller";
import { todo } from "node:test";
import { TodoRoutes } from "./todos/routes";

export class AppRoutes{
    
    
    static get routes():Router{
        const router = Router();
    

        router.use('/api/todos', TodoRoutes.routes) //este es mi punto de entrada
                                                    //si quiero cambiar el inicio de la url de todas las rutas es aqui
     

        return router
    }
}
~~~

## CRUD

- Guardo el array de todos del controlador en una variable y se la paso al controller

~~~js
const todos = [
    { id: 1, title: "Todo 1", completed: false },
    { id: 2, title: "Todo 2", completed: true },
    { id: 3, title: "Todo 3", completed: false }
]
export class TodosController{
    
    constructor(){

    }

    public getTodos=(req: Request, res: Response) => {  
        return  res.json(todos)
    }   
}
~~~

- **todo por id**
- Debo validar si recibo un id válido y que existe
- Defino la ruta en TodoRoutes
- *NOTA* los parametros siempre son strings
- Si añadiéndole + para convertirlo a numero, el valor que le paso no es convertible me devolverá null
- Si no lo encuentra me devuelve un status 200, si el id es un numero pero no hay ningun todo me sigue devolviendo un 200
- Debemos regresar errores correctos

~~~js
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

    public todoById(req: Request, res: Response){
        const id = +req.params.id

        const todo: Todo | undefined = todos.find(todo => todo.id === id)
        
        if(isNaN(id)) return res.status(400).json({error: "Invalid ID"})
        
        if (todo) {
            res.json(todo)
        } else {
            res.json({ error: "Todo not found" })
        }
    }
}
~~~
-----

## CREATE

- Hay varios formatos para enviar el POST
- Los más comunes son form-data, x-www-form-urlencoded y raw
- Pongamos que quiero enviar raw de tipo JSON
# SIEMPRE HAY QUE PENSAR QUE EL CLIENTE VA A HACER MAL LA PETICIÖN
- Hay que validar todas las posibilidades
- Creo el método en todos.controller y añado la ruta en el routes de todos

~~~js
export class TodoRoutes{
    
    
    static get routes():Router{
        const router = Router();
        const todosController = new TodosController();

        router.get('/', todosController.getTodos) //solo mandamos la referencia a la función
        router.get('/:id', todosController.todoById) //solo mandamos la referencia a la función
        router.post('/', todosController.createTodo) 
        return router
    }
}
~~~

- En TodosController

~~~js
public createTodo(req:Request, res:Response){ 
    const {id, title, completed} = req.body
    if(!title) return new Error({message: "Title ios required" })

    const newTodo= {
        id: todos.lengthg +1,
        title,
        completed
    }
    todos.push(newTodo)

    res.json(newTodo)

}
~~~

- Para trabajar con jsons debo agregar el middleware en el server.ts

~~~js
    async start(){


        //middlewares
        this.app.use(express.json()) //habilito el trabajar con JSON
        //también el x-www-form-urlencoded
        this.app.use(express.urlencoded({extended:true}))

        //Public Folder
        this.app.use(express.static(this.publicPath))


        this.app.use(this.routes)

        this.app.get('*', (req,res)=>{
          const indexPage = path.join(__dirname, `../../${this.publicPath}/index.html`)  
          res.sendFile(indexPage)  
        })
        
        this.app.listen(this.port, ()=>{
            console.log("corriendo en el 3000!")
        })
    }
~~~

- Vamos en la dirección de hacer todo esto con un a db y arquitrectura limpia
----

## UpdateTodo

~~~js

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
~~~

## Delete

~~~js
public deleteTodoById(req:Request, res:Response){
        const id = +req.params.id

        if(isNaN(id)) return res.status(400).json({error: "Invalid ID"})

        const index = todos.findIndex(todo => todo.id === id)
        if(index === -1) return res.status(404).json({error: "Todo not found"})

        todos.splice(index, 1)
        res.json({message: "Todo deleted"})
    }
~~~