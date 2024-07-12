# REST SERVER POSTGRESQL

- Usaremos TMDB
- Creo la conexion con la db usando docker
- .env

~~~
PORT=3000
PUBLIC_PATH=public

POSTGRES_URL=postgresql://postgres:root@localhost:5432/TODO
POSTGRES_USER=postgres
POSTGRES_DB=TODO
POSTGRES_PORT=5432
POSTGRES_PASSSWORD=123456

NODE_ENV=development
~~~

- En la raiz del proyecto creo docker-compose.yaml

~~~yaml
version: '3.8'
services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - ./data:/var/lib/postgresql/data
    ports:
      - 5432:5432
~~~

- Ignoramos postgres/ en gitignore
- Levantamos la db. La -d es de detouch para despegar la consola de todos los logs

> docker compose up -d

- Instalo prisma. Genero el archiuvo de configuración

> npx prisma init --datasource-provider postgresql

- Cambio el datasource por la variable de entorno
- Defino el modelo

~~~js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}


model todo{
  id Int @id @default(autoincrement())
  text String @db.VarChar
  completedAt DateTime? @db.Timestamp() 
}

~~~

- Hagamos la migración

> npx prisma migrate dev --name init

- *Your database is now in sync with your schema*

- Creo la conexión en TablePlus
-----

# Crear TODO

- Creo src/data/postgres/index.ts (barril)
  
~~~js
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()
~~~

- Primero vamos a hacer todo el código, validaciones, llamados a la db, en los controladores
- Luego mediante refactorización emplearemos arquitectura limpia
- En createTodo llamo a prisma
- Más adelante usaremos DTOs para validar la data de entrada

~~~js
public async createTodo(req:Request, res:Response){ 
    const {text} = req.body
    
    if(!text) return res.status(400).json({error: "Text is required"})
    
        const newTodo= await prisma.todo.create({
        data: {
            text
        }
    
    })

    res.json(newTodo)

}
~~~

- Todo es lo mismo: prisma.todo.update, .delete, .find, .findMany, etc
- Haz la tarea si quieres! 
-----

## DTOs

- Validemos la data de entrada para createTodo
- Podemos usar un middleware con express-validator
- Pero lo haremos de otra manera
- Creo domain/dtos/todos/todo.dto.ts  (en domain porque son reglas)
- Creo un constructor privado. Solo se va a poder llamar dentro de un metodo estático de la clase
- Creo un metodo estático, las properties simularán el objeto del req.body
- Retornará o un string o una instancia del dto
- Lo pongo dentro de un arreglo para usar desestructuración. 
- Los hago los dos opcionales porque si tengo el string es que tengo un error y si  no tengo la instancia del DTO

~~~js
export class createTodoDto {

    private constructor(
        public readonly text: string
    ){
        this.text = text
    }

    static create(props: {[keys: string]: any}): [string?, createTodoDto?] {
        const {text} = props

        if(!text) return ["Text is required", undefined]

        
        
        return [undefined, new createTodoDto(text)]
    }
    
}
~~~

~~~js
    public async createTodo(req:Request, res:Response){ 

        const createTodoDto= CreateTodoDto.create(req.body)

        if(createTodoDto[0]) return res.status(400).json({error: createTodoDto[0]})
            
        const {text} = req.body
        
        if(!text) return res.status(400).json({error: "Text is required"})
        
            const newTodo= await prisma.todo.create({
            data: createTodoDto!
        
        })

        res.json(newTodo)

    }
~~~

- Otra manera sería usando desestructuración

~~~js
    public async createTodo(req:Request, res:Response){ 

        //const createTodoDto= CreateTodoDto.create(req.body)
        const [error,createTodoDto] = CreateTodoDto.create(req.body)

        if(error) return res.status(400).json({error})
            
        const {text} = req.body
        
        if(!text) return res.status(400).json({error: "Text is required"})
        
            const newTodo= await prisma.todo.create({
            data: createTodoDto!
        
        })

        res.json(newTodo)

    }
~~~
-----

## UpdateDto

- En  el update haré el texto y la fecha opcionales
- Puede pasarme las dos (texto y fecha), una de las dos o ninguna de las dos
- Debo asegurarme que el texto sea un string y la fecha una fecha
- Como los dos valores son opcionales, creo un getter para obtener el objeto para el dto

~~~js
get values(){
const returnobj:{[key:string]: any} = {}
if(this.text) returnobj.text = this.text     
if(this.completedAt) returnobj.completedAt = this.completedAt
return returnobj     
}
~~~

- El dto
- Le paso al constructor los valores opcionales que puede tener el req.body. El id es obligatorio
- Creo un getter que retorna el objeto que asemeja el del req.body para obtener los valopres desde el controlador
- En el metodo create, o retorno el string de error o el dto 

~~~js
export class UpdateTodoDto {

    private constructor(
      public readonly id: number,
      public readonly text?: string,
      public readonly completedAt?: Date,
    ){}
  
    get values() {
      const returnObj: {[key: string]: any} = {};
  
      if ( this.text ) returnObj.text = this.text;
      if ( this.completedAt ) returnObj.completedAt = this.completedAt;
  
      return returnObj;
    }
  
  
    static create( props: {[key:string]: any} ): [string?, UpdateTodoDto?]  {
  
      const { id, text, completedAt } = props;
      let newCompletedAt =completedAt; // si viene completedAt la guardo aqui
  
      if ( !id || isNaN( Number(id)) ) {
        return ['id must be a valid number']; //si da error retornará este string
      }
  
      if ( completedAt ) {
        newCompletedAt = new Date( completedAt) //la formateo
        //la valido
        if ( newCompletedAt.toString() === 'Invalid Date' ) {
          return ['CompletedAt must be a valid date']
        }
      }
  
      return [undefined, new UpdateTodoDto(id, text, newCompletedAt)]; //si no da error retornará la instancia con los nuevos valores
    }
  
  
  }
~~~

- En el controlador

~~~js
public updateTodo = async( req: Request, res: Response ) => {
    const id = +req.params.id; //casteo el id de la url

    const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id}); //creo el dto y extraigo el valor de retorno
    if ( error ) return res.status(400).json({ error }); //si hay error devuelvo el error
    
    //busco el todo
    const todo = await prisma.todo.findFirst({
        where: { id }
    });

    if ( !todo ) return res.status( 404 ).json( { error: `Todo with id ${ id } not found` } );

    const updatedTodo = await prisma.todo.update({
        where: { id },
        data: updateTodoDto!.values //le paso los valores con el getter
    });
    
    res.json( updatedTodo );

    }
~~~

- Recuerda agregar la ruta!
- todos/routes.ts

~~~js
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
~~~
-------------

## Aprovisionar DB

- En railway puedo subir mi DB. Me entregará una cadena de conexión
- Para desplegar mi db cambio el string de conexión por el proporcionado
- Creo un nuevo scripot en el package.json

> "prisma:migrate:prod":"prisma migrate deploy"

- Lo incluyo en el build

> "build":"rimraf ./dist && tsc && npm run prisma:migrate:prod"

