# NODE MICROSERVICIOS GRAPHQL

- Repasemos el API GATEWAY
- No es más que una aplicación REST que llama al eventBroker y devuelve la data
- EL server del api-gateway es asi

~~~js
import express, { Request, Response } from 'express'
import axios from 'axios';
import cors from 'cors'


const app = express()

app.use( express.json() ); // raw
app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
app.use(cors())
app.use(express.json)

app.post("/api/v1", async (req: Request, res: Response)=>{
  const {event, data: requestData} = req.body

  if(!event){
    return res.status(400).json({
      message: "Event is required"
    })
  }


    try {
      const {data} = await axios.post("http://localhost:3001/events",{
        requestData,
        event: event.toUpperCase()
      })
     
      return res.status(200).json({
        message: "Success!!",
        data
      })

    } catch (error) {
      return res.status(500).json({
        message: "Error gateway",
        
      })       
    }
})

app.listen(process.env.PORT, ()=>{
  console.log("API GATEWAY IS RUNNING ON PORT", process.env.PORT)
})
~~~

- Este endpoint events de tipo POST se encuentra en el server de event-broker, que llama al eventBrokerController
- Es POST porque necesito mandarle el evento ("GET_PRODUCTS",. etc)
- Según el event  se llamará al controlador que tiene la lógica, en este caso un método GET

~~~js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { eventBrokerController } from "./controllers/events.controller";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.post("/events", eventBrokerController);

app.listen(port, () => {
  console.log("Event Broker is running on port:", port);
});
~~~

- En el controller del microservicio event-broker hago uso de los enums para filtrar por event

~~~js
import { Request, Response } from "express";
import { ProductsEvent } from "../enums/products.enum";
import { getAllProducts } from "./products.controller";
import { UsersEvent } from "../enums/users.enum";
import { getAllUsers } from "./users.controller";
import { SalesEvent } from "../enums/sales.enum";
import { createSale } from "./sales.controller";

export const eventBrokerController = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  if (event === ProductsEvent.GET_PRODUCTS) {
    const products = await getAllProducts();

    return res.status(200).json({
      data: products,
    });
  }

  if (event === UsersEvent.GET_USERS) {
    const users = await getAllUsers();

    return res.status(200).json({
      data: users,
    });
  }

  if (event === SalesEvent.CREATE_SALE) {
    const sale = await createSale(data);

    return res.status(200).json({
      data: sale,
    });
  }

  return res.status(404).json({
    message: "Event not found",
  });
};
~~~

- Desde aquí llamo a cada controlador creado en el eventbroker/src/controllers para cada microservicio.
- Por ejemplo el de products
- event-broker/src/controllers/products.controller

~~~js
import axios from "axios";

const productsApi = axios.create({
  baseURL: "http://localhost:3002/products",
});

export const getAllProducts = async () => {
  const { data } = await productsApi.get("/all"); //apunta al get de products

  return data;
};
~~~

- En products.routes tengo esto

~~~js
import { Router } from "express";
import { getAll } from "../controllers/products.controller";

const router = Router();

// GET: /products/all
router.get("/all", getAll);

export default router;
~~~

- Desde aquí hago la petición al endpoint del microservicio, por lo que solo expongo el gateway al exterior 
- En el products.controller del ms products tan solo tengo un endpoint con data almacenada en memoria

~~~js
import { Request, Response } from "express";
import { IProduct } from "../interfases/products.interface";

const products: IProduct[] = [
  {
    id: "1",
    name: "Teclado Mecanico",
    price: 150,
    description: "Teclado Mecanico",
  },
];

//aqui tengo el getAll
export const getAll = (req: Request, res: Response) => {
  return res.status(200).json({ message: "OK", products });
};
~~~

- El server de products es así

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ProductsRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send(`Products Microservice is running: ${port}`);
});

app.use("/products", ProductsRoutes);

app.listen(port, () => {
  console.log("Products Microservice is running on port:", port);
});
~~~


- **Resumiendo**:
  - Expongo el puerto localhost:3000 del **api-gateway** en el endpoint /api/v1
  - Desde aqui llamo al endpoint localhost:3001/events del **event-broker**
  - En el event-broker evalúo que tipo de event me están pasando como cadena de texto
  - Tengo los diferentes strings guardados en enums para cada caso de uso
  - Desde el event-broker llamo al controlador correspondiente que apunta al endpoint del microservicio en concreto
  - Desde ese endpoint tengo otro controlador que es el que contiene la lógica del microservicio
------

## GraphQL

- Borramos el api-gateway server para instalar graphQL
- Instalo con npm @apollo/server graphql 
- Necesito importar **ApolloServer** y **startStandaloneServer**
- necesito que hayan typeDefs y Resolvers (al menos uno!)
- api-gateway/src/index.ts

~~~js
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import dotenv from "dotenv";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

import { EventBrokerAPI } from "./datasources/eventBroker.datasource";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//debo desestructurar la url
const { url } = await startStandaloneServer(server, {
  listen: {
    port: parseInt(process.env.PORT),
  },
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        eventBrokerAPI: new EventBrokerAPI({ cache }),
      },
    };
  },
});

console.log(`GraphQL API Gateway started: ${url}`);
~~~

- api-gateway/src/typeDefs/index.ts


- Usaremos el ejemplo de books
- api-gateway/src/typeDefs/typeDefs.ts

~~~js

export const typeDefs = `#graphql

    type Book{
    title: String
    author: string}

    type Query{
    books: [Books]}
`
~~~

- En api-gateway/src/reolvers/books.resolver.ts

~~~js
//en los resolvers no suelo tener la data así

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];


export const booksQuery= {
  Query: {
    books: ()=> books
  }
}
~~~

- En api-gateway/src/reolvers/index.ts uso el spread para que integre todas las funciones que tengo ahi

~~~js
import {booksQuery} from ....

export const resolvers ={
  Query:{
    ...booksQuery
  }
}
~~~

- Mas adelante usaremos otra estratgeia con el eventBroker
- Lo iremos optimizando
------

## Comunicar GraphQL con el event-broker

- Instalamos con npm i **@apollo/datasource-rest**
- Creo el directorio api-gateawy/src/datasources/eventbroker.datasource.ts
- Uso override para sobreescribir la baseURL que apunta al event-broker
- Uso el método emitEvent que me pide el event (string) y la data (any, no te compliques)
- **Retorno** la petición **POST a /events** usando **this** (tengo disponible .post en el this por implementar **RESTDataSource**)
- Deben ir **dentro** de la propiedad **body**
- Esto lo que hace es enviar la petición (emitEvent, no tiene porqué llamarse así)

~~~js
import { RESTDataSource } from "@apollo/datasource-rest";

export class EventBrokerAPI extends RESTDataSource {
  override baseURL: string = "http://localhost:3001/";

  async emitEvent(event: string, data: any) {
    return this.post("/events", { body: { event, data } });
  }
}
~~~

- Hay que agregar el dataSource **dentro del contexto** de GraphQL
- context es una función **async**
  - **Desestructuro el caché** del server de Apollo
  - Retorno un objeto  con otro objeto llamado **datasources** que contiene el **eventBrokerAPI** con una instancia de este
  - Le paso el caché
- En api-gateway/index.ts

~~~js
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import dotenv from "dotenv";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

import { EventBrokerAPI } from "./datasources/eventBroker.datasource";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: parseInt(process.env.PORT),
  },
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        eventBrokerAPI: new EventBrokerAPI({ cache }),
      },
    };
  },
});

console.log(`GraphQL API Gateway started: ${url}`);
~~~

- Ahora ya puedo usar el eventBroker!
-----

## ProductsQuery

- Creo en api-gateway/src/resolvers/products.resolvers.ts
- Creo productsQeury, que será un objeto que reúna todos mis querys
- getAllProducts es una función de flecha con lo que a mi me interesa
  - Desestructuro el event del input y el context. el guión bajo es porque el primer parámetro no me interesa

~~~js
export const productsQuerys = {
  getAllProducts: (_, { input: { event } }, context) => {
    //console.log(event)

    return {
      name: "Teclado Mecanico",
      price: 150,
    };
  },
};
~~~

- Debo definir el tipo product
- Si lo tuviera todo dentro de una variable llamada typeDefs sería así
- En Query debo decirle a graphQL que getAllProducts me devolverá un objeto de tipo Product (con name y price)
- api-gateway/src/typeDefs/typeDefs.ts

~~~js
export const typeDefs = `#graphql

  type Product {
    name: String
    price: Int
  }

  type Query {
    books: [Book]
    getAllProducts: Product
  }

`;
~~~

- Debo registrar el resolver!
- qpi-gateway/src/resolvers/index

~~~js
imports (...)

export const resolvers = {
  Query: {
    ...booksQuery,
    ...productsQuery
  },
  
};
~~~

- Para hacer el query desde Apollo (en localhost:3000)

~~~gql
query {
  getAllProducts{
    name
    price
  }
}
~~~

- Esta no es la manera óptima de trabajar, es solo con fines didácticos
- Crearemos un input que nos permita captar la info del input y el context del getAllProducts
-----

## EventBrokerInput

- Debo definir un input para todos los eventos 
- Cualquier evento ('GET_PRODUCTS', etc) siempre vendrá en forma de input
- Más adelante este input será más avanzado y haremos tipados más complejos
- fetAllProducts recibirá un input de tipo EventBrokerInput y retornará algo de tipo Product
- En typeDefs.ts
~~~js
export const typeDefs = `#graphql
  
  input EventBrokerInput {
    event: String
    data: String
    
  }

  type Product {
    name: String
    price: Int
  }

  type Query {
    books: [Book]
    getAllProducts(input: EventBrokerInput): Product
  }

`;
~~~

- Ahora en la query debo pasarle el input
- Guardo el tipo EventBrokerInput en $input y se lo paso a getAllProducts
- En el apartado VARIABLES de ApolloServer coloco el event dentro de input

~~~gql
query getAllProducts($input: EventBorkerInput){
  getAllProducts(input: $input){
    name
    price
  }
}

//VARIABLES

{
  "input":{
    "event": "GET_PRODUCTS"
  }
}
~~~

- Puedo hacer un console.log al event para ver que realmente lo estoy recibiendo
- En realidad lo que queremos es solo un input, una llave de entrada y una de salida
- La emisión de un evento y ya está
- Lo hemos hecho de esta manera para entender cómo funciona
-----

## Cambiar Querys por Mutation

- Usar **un query para cada petición no es óptimo**
- Porqué usar **Mutation**?
- Si no voy a tener que estar estructurando querys, definiendo tipos...
- En el index.ts de los resolvers borro los querys que habían
- Indico que el service me retorne el string de API-GATEWAY (no hará nada más)
- resolvers/index.ts

~~~js
import { eventBrokerMutation } from "./eventBroker.resolvers";

export const resolvers = {
  Query: {
    service: () => "API Gateway",
  }
};
~~~

- Para comprobar que funciona DEBO BORRAR los type Query de typeDefs.ts y colocar el service
- Le añado un **!** porque siempre lo va a retornar
- typeDefs/typeDefs.ts

~~~js
export const typeDefs = `#graphql
  
  input EventBrokerInput {
    event: String
    data: String
    
  }

  type Product {
    name: String
    price: Int
  }

  type Query {
   service: String! ## lo coloco aquí!!
  }

`;
~~~

- La consulta ahora sería

~~~gql
query{
  service
}
~~~

- Me retorna "API Gateway"
- Defino un nuevo type Mutation
- Mutation porque puedo enviar datos, objetos vacíos, puedo mandar data y **mutarla**
- Diré que recibe un input de tipo EventBrokerInput y **siempre retornará** algo de tipo Response
- En el EventBroker hago el event será **obligatorio**, lo marco con **!**
- Si no coloco un ! **es opcional**
- El queryData será de tipo string **de momento**
- qpi-gateway/src/typeDefs/typeDefs.ts

~~~js
export const baseTypes = `#graphql
  input QueryData {
    sales: CreateSalesInput
  }

  input EventBrokerInput {
    service: String!
    event: String!
    queryData: String ##recibe la data de la query
  }

  union response = Product

  type Query {
    service: String!
  }

  type Mutation {
    sendEvent(input: EventBrokerInput!): Response!
  }
`;
~~~

- Vamos a definir la Response como una **unión**
- Unión significa **une varios tipos**. La respuesta puede ser de tipo Products, Users, etc
- Lo coloco en el mismo archivo dentro del objeto graphql de typeDefs
- Creo el archivo api-gateway/src/resolvers/EventBrokerMutation.resolver.ts
- El context es con lo que nos vamos a conectar con los datasources

~~~js
export const eventBrokerMutation = {
  sendEvent: (_, input, context)=>{
    return   {
    __typename: "Product",
    name: "Teclado Mecanico",
    price: 150,
  },
  
  }
}
~~~

- En resolvers/index.ts le paso el Mutation

~~~js
import { eventBrokerMutation } from "./eventBroker.resolvers";

export const resolvers = {
  Query: {
    service: () => "API Gateway",
  },
  Mutation: {
    ...eventBrokerMutation,
  },
};
~~~

- Ahora el query es una mutation
- Al ser la respuesta de tipo Response como definimos en typeDefs, puede ser de tipo Product (y otros que no hemos definido en la union)
- Este código me devuelve el error de **Abstract type**, gql no sabe de que tipo es
~~~gql
mutation($input: EvenetBrokerInput){
  sendEvent(input: $input){
    __typename
  }
}

##VARIABLES

{
  "input":{
    "event": "GET_PRODUCTS"
  }
}
~~~

- Debo definir el __typename en el **EventBrokerMutation**, si no gql no sabe de que tipo es

~~~js
export const eventBrokerMutation = {
  sendEvent: (_, input, context)=>{
    return   {
    __typename: "Product",
    name: "Teclado Mecanico",
    price: 150,
  },
  
  }
}
~~~

- Si trato de obtener el name directamente en la query me da error  de Cannot query field "name", puede que sea un fragment de Product
- Para obtener el name debo usar una sintaxis concreta, como el spread operator, donde le digo toda la respuesta (...) conviertela a tipo Product

~~~gql
mutation($input: EventBrokerInput!){
  sendEvent(input: $input){
    ... on Product  #Vuelve la respuesta de tipo Product
  }
}

##VARIABLES

{
  "input":{
    "event": "GET_PRODUCTS",
    "queryData": "",
    "type": "Product"
  }
}
~~~

- Con esto vamos a diferenciar el tipo de respuesta
- GraphQL ya crea un diccionario de estos desde ApolloServer
- Root/Mutation/sendEvent (click on) 
- Me dice **Possible Types**
  - Product (name, price)
- Si en las variables desde ApolloServer coloco queryData como un objeto vacío me marca error
- Me pide que sea String como tipé anteriormente
- Necesito tipar el input de otra manera, le añado la propiedad type
  - (borro el __typename anterior del BrokerMutation)

~~~js
export const baseTypes = `#graphql
  input QueryData {
    sales: CreateSalesInput
  }

  input EventBrokerInput {
    type: String! # añado el type forzoso
    event: String!
    queryData: QueryData
  }

  type Query {
    service: String!
  }

  type Mutation {
    sendEvent(input: EventBrokerInput!): Response!
  }
`;
~~~

~~~js
export const eventBrokerMutation = {
  sendEvent: (_, {input}, context)=>{
    return   {
    //__typename: "Product",
    name: "Teclado Mecanico",
    price: 150,
  },
  
  }
}
~~~

- En las VARIABLES de la query debo añadir el type
- ApolloServer
~~~gql
mutation($input: EventBrokerInput!){
  sendEvent(input: $input){
    ... on Product { #Vuelve la respuesta de tipo Product
      name # Obtengo el name de Product
    }
  }
}

##VARIABLES

{
  "input":{
    "event": "GET_PRODUCTS",
    "queryData": "",
    "type": "Product"
  }
}
~~~

- Desestructuremos algunas cosas del input desde eventBrokerMutation
- Filtro y convierto todo a minúsculas, para buscar el tipo que inlcuya el parámetro (que también paso a minúsculas) 
- Me lo devuelve como un arreglo, paso el arreglo a string con toString y le concateno una s al final 
- api-gateway/src/resolvers/eventBroker.resolver.ts

~~~js
import { typeList } from "../typelist";

export const eventBrokerMutation = {
  sendEvent: async (_, { input }, context) => {
    const { type, event, queryData } = input;

    const typename =
      typeList
        .filter((t) => type.toLowerCase().includes(t.toLowerCase()))
        .toString() + "s"; //


    return {
      __typename: typename,
      name: "teclado mecánico",
      price: 100
    };
  },
};
~~~

- Creo en api-gateway/src/typeList/typeList.ts
- Puedo declarar todos los tipos que quiera en este typeList

~~~js
export const typeList = ["Product", "Sale"];
~~~
-----

## Obtener datos del EventBroker

