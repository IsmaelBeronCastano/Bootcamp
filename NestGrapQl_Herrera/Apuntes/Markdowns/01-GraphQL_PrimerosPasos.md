# GraphQL NEST - Primeros pasos

- GraphQL me servirá para que el frontend se autoabastezca de lo que necesite haciendo una petición a un único endpoint
- *LINKS DE INTERÉS*
  - graphql.org
  - docs.nestjs.com/graphql
  - fireship.io
- GraphQL **es un lenguaje para leer y mutar data mediante APIs**. Un **Query Language**
- Es agnóstico
- Puedo tipar objetos para que el frontend demande la información que necesita de la manera correcta
- Puedo mezclar el único endpoint de graphQL con unb API REST
- GraphQL hace un query y el backend devuelve la data. Hay menos trabajo en el backend (de código)
- Hay dos formas de trabajar NEST + GraphQL
  - **Schema First** - Es la manera tradicional de GraphQL para la creación de schemas.º
  - **Code First** - Creamos las clases y definiciones en TS y esto automáticamente nos creará el SDL (Schema Definition Language) 
- Todo graphQL endpoint tiene al menos un tipo **Query definido**
- Para realizar cambios en la data, existe el tipo **Mutation** el cual sirve para **mutar la data**
- Si habilitamos la opción visual (recomendable) podemos seleccionar campos, la data, y generar el query
- Muy útil para trabajar con autenticación, para validar JWT, etc
- Sabiendo NEST; solo hay que conocer **un par de decoradores** y **un par de conceptos propios de GraphQL**
------

## Proyecto NEST GraphQL

- Aplicación de TODOS
- Si trabajas con el código fuente será necesario actualizar algunos paquetes borrando los del package.json

> npm i @nestjs/apollo @nestjs/common @nestjs/core @nestjs/graphql @nestjs/platform-express apollo-server-core apollo-server-express graphql 

- Si generas el proyecto por tu cuenta solo necesitarás estos

> npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express

- Nest trabaja por defecto sobre express, por eso apollo-server-express
- Hay que hacer la configuración del ApolloDriver
- Necesita al menos una consulta
- En el app.module

~~~js
import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), //process.cwd es la carpeta donde se ejecuta el proyecto y le paso el schema
      playground: false, //en true habilita la interacción visual en localhost:3000/graphql
      plugins: [
     
      ]
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- Con el app.module así me salta un error que dice "Query root type must be provided"
- Creo el módulo HelloWorld nest mo HelloWorld
- hellowrorld.module

~~~js
import { Module } from '@nestjs/common';
import { HelloWorldResolver } from './hello-world.resolver';

@Module({
  providers: [ HelloWorldResolver ]
})
export class HelloWorldModule {}
~~~

- helloWorld.resolver
- Uso el decorador Resolver
- Uso Query de /graphql (hay otro de /common)
- Tengo que decirle al Query lo que va a devolver. Coloco una función de flecha y le digo que será de tipo String
- En un objeto añado una descripción y el nombre de la query
- En getRandomFromZeroTo tengo @Args para el argumento que quiero recibir
- Hacemos la validación manual (en lugar de usar un dto)
    - Puede ser nulo
    - En type le digo que puede devolver un entero
    - En el valor de vuelta le digo que to es un number y le asignoi 6 por defecto

~~~js
import { Float, Query, Resolver, Int, Args } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {

    @Query( () => String, { description: 'Hola Mundo es lo que retorna', name: 'hello' } )
    helloWorld(): string {
        return 'Hola Mundo';
    }

    @Query( () => Float, { name: 'randomNumber' } )
    getRandomNumber(): number {
        return Math.random() * 100;
    }
    
    // randomFromZeroTo
    @Query( () => Int, { name: 'randomFromZeroTo', description: 'From zero to argument TO (default 6)' } )
    getRandomFromZeroTo( 
        @Args('to', { nullable: true, type: () => Int } ) to: number = 6
    ): number {
        return Math.floor( Math.random() * to );
    }

}
~~~

- Creando este resolver "mágicamente" (con el servidor levantado) apareció el schema.gql
- No se modifica jamás (se sobreescribe continuamente)

~~~gql
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Query {
  """Hola Mundo es lo que retorna"""
  hello: String!
  randomNumber: Float!

  """From zero to argument TO (default 6)"""
  randomFromZeroTo(to: Int): Int!
}
~~~

- El endpoint por defecto es http://localhost:3000/graphql donde voy a tener el apollo-server en el que escribir querys
- Para poder visualizarlo tiene que estar el playground en true en el app.module
- Escribo mi primera query desde el navegador

~~~graphql
query{
    helloWorld   //le paso el nombre de la Query (de la función que usé como Query)
}
~~~

- Esto nos devuelve 

~~~json
{
    "data":{
        "helloWorld": "Hola Mundo"
    }
}
~~~

- Puedo renombrar la consulta (es lo que mandaría desde el frontend)

~~~graphql
query{
    hola: helloWorld  
}
~~~

- Que me retornaría hola: "Hola Mundo"
- En el playground tengo en un lateral los Docs con las querys que tengo armadas
- Al haber puesto en el objeto la description y el name, puedo usar el string del name para hacer la query

~~~js
 @Query( () => String, { description: 'Hola Mundo es lo que retorna', name: 'hello' } )
    helloWorld(): string {
        return 'Hola Mundo';
    }
~~~

- La query

~~~graphql
query{
    hello
}
~~~

- Con POSTMAN no tenemos la mejor de las interfaces
- Trabajaremos con **Apollo Studio** que tiene un montón de funciones interesantes, reemplazando el playground por defecto en graphql
- npm i apollo-server-core
- Me ha dado problemas con el tipado en el forRoot, lo quito y añado ApolloServerPluginLandingPageLocalDefault()

~~~js
import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver} from '@nestjs/apollo';
import { HelloWorldModule } from './hello-world/hello-world.module';
import {ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';


@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false, 
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ]
    }),
    HelloWorldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
~~~

- En el mismo endpoint de 3000/graphql aparece apollo Studio en el browser
- Necesita conexión, puedes usar el playground también 
-----

# 2da PARTE

## Todo Resolver y Custom Object Type

- Genero en la carpeta todo el todo.module, el todo.resolver(*nest g r todo*) el todo.service y las carpetas dto, entity y types
- Lo generaremos automáticamente, ahora lo hacemos manual
- El resolver no es más que una simple clase con el decorador @Resolver
- hacemos el CRUD entero a lo GraphQL
- todo.resolver
- Uso @Mutation cuando voy a mutar data

~~~js
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entity/todo.entity';

import { CreateTodoInput, UpdateTodoInput, StatusArgs } from './dto';
import { AggregationsType } from './types/aggregations.type';

@Resolver( () => Todo )
export class TodoResolver {

    constructor(
        private readonly todoService: TodoService
    ){}


    @Query( () => [Todo], { name: 'todos' })
    findAll(
        @Args() statusArgs: StatusArgs
    ): Todo[] {
        return this.todoService.findAll( statusArgs );
    }

    @Query( () => Todo, { name: 'todo' })
    findOne(
        @Args('id', { type: () => Int } ) id: number
    ) {
        return this.todoService.findOne( id );
    }

    @Mutation( () => Todo, { name: 'createTodo' })
    createTodo(
        @Args('createTodoInput') createTodoInput: CreateTodoInput
    ) {
        return this.todoService.create( createTodoInput );
    }

    @Mutation( () => Todo, { name: 'updateTodo' })
    updateTodo(
        @Args('updateTodoInput') updateTodoInput: UpdateTodoInput
    ) {
        return this.todoService.update( updateTodoInput.id, updateTodoInput );
    }

    @Mutation( () => Boolean )
    removeTodo(
        @Args('id', { type: () => Int }) id: number
    ) {
        return this.todoService.delete( id );
    }


    // Aggregations
    @Query( () => Int, { name: 'totalTodos' })
    totalTodos(): number {
        return this.todoService.totalTodos;
    }

    @Query( () => Int, { name: 'pendingTodos' })
    pendingTodos(): number {
        return this.todoService.pendingTodos;
    }

    @Query( () => Int, { name: 'completedTodos' })
    completedTodos(): number {
        return this.todoService.completedTodos;
    }

    @Query( () => AggregationsType )
    aggregations(): AggregationsType {
        return {
            completed: this.todoService.completedTodos,
            pending: this.todoService.pendingTodos,
            total: this.todoService.totalTodos,
            totalTodosCompleted: this.todoService.totalTodos,
        }
    }
}
~~~

- types/AggregationsType
- Para crear un tipo personalizado acabaremos usando los tipos Int, Float, String, Boolean, ID
- Uso @ObjectType para definirlo como un tipo de graphQL
- Uso @Field para indicarle a graphQL el tipo

~~~js
import { Field, Int, ObjectType } from '@nestjs/graphql';


@ObjectType({ description: 'Todo quick aggregations' })
export class AggregationsType {

    @Field( () => Int )
    total: number;

    @Field( () => Int )
    pending: number;

    @Field( () => Int )
    completed: number;

    @Field( () => Int, { deprecationReason: 'Most use completed instead' })
    totalTodosCompleted: number;

}
~~~

- El todo.service (como no usamos DB de momento el código es más complejo de lo que debería)

~~~js
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { Todo } from './entity/todo.entity';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {

    private todos: Todo[] = [
        { id: 1, description: 'Piedra del Alma', done: false },
        { id: 2, description: 'Piedra del Espacio', done: true },
        { id: 3, description: 'Piedra del Poder', done: false },
        { id: 4, description: 'Piedra del Tiempo', done: false },
    ];

    get totalTodos() {
        return this.todos.length;
    }

    get pendingTodos() {
        return this.todos.filter( todo => todo.done === false ).length;
    }

    get completedTodos() {
        return this.todos.filter( todo => todo.done === true ).length;
    }



    findAll(  statusArgs: StatusArgs ): Todo[] {
        
        const { status } = statusArgs;
        if( status !== undefined ) return this.todos.filter( todo => todo.done === status );
        
        return this.todos;
    }

    findOne( id: number ): Todo {

        const todo = this.todos.find( todo => todo.id === id );

        if ( !todo ) throw new NotFoundException(`Todo with id ${ id } not found`);

        return todo;
    }

    create( createTodoInput: CreateTodoInput ): Todo {

        const todo = new Todo();
        todo.description = createTodoInput.description;
        todo.id = Math.max( ...this.todos.map( todo=> todo.id ), 0 ) + 1

        this.todos.push( todo );

        return todo;
    }


    update( id: number, updateTodoInput: UpdateTodoInput ) {
        const { description, done } = updateTodoInput;
        const todoToUpdate = this.findOne( id );

        if ( description ) todoToUpdate.description = description;
        if ( done !== undefined ) todoToUpdate.done = done;

        this.todos = this.todos.map( todo => {
            return ( todo.id === id ) ? todoToUpdate : todo;
        });

        return todoToUpdate;

    }

    delete( id: number ):Boolean {
        const todo = this.findOne( id );

        this.todos = this.todos.filter( todo => todo.id !== id );

        return true;
    }
}
~~~


- entity/todo.entity
- @ObjectType en lugar de @Entity para decirle que es mi objeto personalizado de graphQL
  - Puedo añadir en el mismo archivo @Entity para trabajar con mongoose  
- @Field para indicar el tipo para graphQL

~~~js
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {

    @Field( () => Int )
    id: number;

    @Field( () => String )
    description: string;

    @Field( () => Boolean )
    done: boolean = false;

}
~~~
