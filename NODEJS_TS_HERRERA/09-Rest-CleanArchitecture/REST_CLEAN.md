# REST CLEAN ARCHITECTURE

- Aplicaremos DDD y el patrón repositorio
---

## TodoEntity

- Creo domain/entities/todo.entity.ts

~~~js
export class TodoEntity{

    constructor(
        public id: number,
        public text: string,
        public completedAt?: Date | null
    ){}

    get isCompleted(){
        return !!this.completedAt
    }
}
~~~
-----

## DataSource

- Creo domain/datasources/todo.datasource.ts y domain/repositories
- Creo las normas que regirán en ms datasources

~~~js
import { CreateTodoDto } from "../dtos/todos/todo.dto";
import { UpdateTodoDto } from "../dtos/todos/update.dto";
import { TodoEntity } from "../entities/todo.entity";

export abstract class TodoDataSource{
    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>

    //todo:paginación
    abstract getAll(): Promise<TodoEntity[]>

    abstract findById(id: number): Promise<TodoEntity | null>
   
    abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity | null>

    abstract deleteById(id: number): Promise<TodoEntity | null>
}
~~~

- Vamos a tener que añadir algunas modificaciones cuando agreguemos paginaciones
- El repositorio es la misma implementación ya que voy a usar los mismos métodos

~~~js
import { CreateTodoDto } from "../dtos/todos/todo.dto";
import { UpdateTodoDto } from "../dtos/todos/update.dto";
import { TodoEntity } from "../entities/todo.entity";

export abstract class TodoRepository{
    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>

    //todo:paginación
    abstract getAll(): Promise<TodoEntity[]>

    abstract findById(id: number): Promise<TodoEntity | null>
   
    abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity | null>

    abstract deleteById(id: number): Promise<TodoEntity | null>
}
~~~

- En otro panorama, podría crearme un servicio en el que añadir toda mi lógica.
- La idea es tener un solo logar para poder acceder a toda la info, para que si eso cambia, cambiar el servicio y listo
- Sigamos con el DDD y los casos de uso
------

## TodoDataSource implementation

- Las implementaciones las haré en infraestructure, en este caso /datasource
- Escribo export class ... implements TodoDataSource y Ctrl . para que autoomplete
- Copio el código de cada método correspondiente que hay en el controlador y lo traslado a los métodos del datasource implementation
- *NOTA*: esto es una refactorización a arquitectura limpia

~~~js
async getAll(): Promise<TodoEntity[]> {
    const todos= await prisma.todo.findMany()

    return todos
}
~~~

- Esto me marca **ERROR** porque estoy retornando un objeto, no instancias de mi clase que tienen un metodo getter
- Para solucionarlo necesito crear un **mapper** que mapée los objetos y los convierta a instancias de mi clase
- Puedo crear el mapper en un archivo aparte o puedo crear un método en TodoEntity

~~~js
import { CreateTodoDto } from "../dtos/todos/todo.dto";

export class TodoEntity{

    constructor(
        public id: number,
        public text: string,
        public completedAt?: Date | null
    ){}

    get isCompleted(){
        return !!this.completedAt
    }

    public static formJson(object: {[key:string]: any}): TodoEntity{
        const {id, text, completedAt} = object

        if(!id){
            throw new Error('Id is required')
        }

        if(!text){
            throw new Error('Text is required')
        }

        let newCompletedAt;

        if(completedAt){
            newCompletedAt = new Date(completedAt)
        }

        if(isNaN(newCompletedAt.getTime())){
            throw new Error('Invalid date')
        }

       return new TodoEntity(id, text, newCompletedAt)
    }
}
~~~

- En infraestructure/datasource/todo.datasource.impl.ts

~~~js
async getAll(): Promise<TodoEntity[]> {
    const todos= await prisma.todo.findMany()

    return todos.map(todo=> TodoEntity.formJson(todo))
}
~~~

- En infraestructure/repositories/TodoRepositoryImpl
- Le inyecto en el constructor el datasource (no  la implementación del datasource)
~~~js
export class TodoRepositoryImpl implements TodoDataSource{

    constructor(
        private readonly datasource: TodoDataSource
    ){}


    create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        return this.datasource.create(createTodoDto); //lo mismo con el resto de métodos
    }
}
~~~

- La implementeación del repositorio es parecida a lo que había en el controlador

~~~js
import { prisma } from "../../data/postgres";
import { TodoDataSource } from "../../domain/datasources/todo.datasources";
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";
import { TodoRepository } from "../../domain/repositories/todo.repo";


export class TodoRepositoryImpl implements TodoRepository{

    constructor(
        private readonly todoDatasource: TodoDataSource
    ){}


    create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        return this.todoDatasource.create(createTodoDto);
    }

    deleteById(id: number): Promise<TodoEntity> {
        return this.todoDatasource.deleteById(id)
    }

    async getAll(): Promise<TodoEntity[]> {
        return this.todoDatasource.getAll()
    }

    findById(id: number): Promise<TodoEntity> {
        return this.todoDatasource.findById(id)
    }
    
    updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        return this.todoDatasource.updateById(updateTodoDto)
    }
}
~~~

- En infraestructure/datasource/TodoDatasourceImpl

~~~js
import { prisma } from "../../data/postgres";
import { TodoDataSource } from "../../domain/datasources/todo.datasources";
import { CreateTodoDto } from "../../domain/dtos/todos/todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update.dto";
import { TodoEntity } from "../../domain/entities/todo.entity";

export class TodoDatasourceImpl implements TodoDataSource{
    
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto
        })

        return  TodoEntity.formJson(todo)

    }

    async deleteById(id: number): Promise<TodoEntity> {
        
        const deleted = await prisma.todo.delete({
            where: {id}
        })

        return TodoEntity.formJson(deleted)
    }

    async getAll(): Promise<TodoEntity[]> {
        const todos= await prisma.todo.findMany()

        return todos.map(todo=> TodoEntity.formJson(todo))
    }

    async findById(id: number): Promise<TodoEntity> {
       const todo = await prisma.todo.findFirst({
        where: {id}
       })

       if(!todo) throw `todo with id ${id} notfound`

       return TodoEntity.formJson(todo)
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        const todo = await this.findById(updateTodoDto.id)
        const updatedTodo = await prisma.todo.update({
            where:{id:updateTodoDto.id},
            data: updateTodoDto.values
        })

        return TodoEntity.formJson(updatedTodo)
    }
}
~~~
----

## Uso del repositorio en los controladores

- En presentation/todos/todos.controller bien podría inyectar un servicio y es en el servicio dónde irían todas las implementaciones
- Pero aqui lo que quiero hacer, es antes de implementar los casos de usos, hacer uso del repositorio (lo inyecto)
- Podría mandar la implementación pero eso me obligaría a que siempre fuera esa implementación. Le mando el repo "genérico"
- Si voy a presentation/todos/routes me marca error porque necesito proveer a la instancia de TodosController el todoRepository

~~~js
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

~~~

~~~js
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
        const todo= await this.todoRepository.create(req.body as CreateTodoDto)
        return res.json(todo)

    }

    public updateTodo = async( req: Request, res: Response ) => {
        const updatedTodo= await this.todoRepository.updateById(req.body as UpdateTodoDto)
        return res.json(updatedTodo)
      }
    

    public deleteTodoById(req:Request, res:Response){
        return this.todoRepository.deleteById(Number(req.params.id))
    }
}
~~~
--- 


