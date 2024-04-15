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
   
    abstract updateById(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity | null>

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
   
    abstract updateById(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity | null>

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

    public static formJson(object: {[key:string]: any}){
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

-