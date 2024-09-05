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
- Creo el directorio api-gateawy/src/datasources/eventbrouker.datasource.ts
- Uso override para sobreescribir la baseURL que apunta al event-broker
- Uso el método emitEvent que me pide el event (string) y la data (any, no te compliques)
- **Retorno** la petición **POST a /events** usando **this** (tengo disponible .post en el this por implementar **RESTDataSource**)
- Deben ir **dentro** de la propiedad **body**

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

## ProdeuctsQuery

- 