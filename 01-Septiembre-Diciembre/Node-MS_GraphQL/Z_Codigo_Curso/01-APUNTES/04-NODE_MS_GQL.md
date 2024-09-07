# NODE MICROSERVICIOS GQL - 04 RabbitMQ

- Para usar RabbitMQ haré uso de Docker
- RabbitMQ no es la única opción, podriamos usar NATS entre otros
- RabbitMQ es un servidor de mensajería asíncrona que puede trabajar como un balanceador de carga
- Se usa para tener una comunicación fácil entre microservicios 
- Tiene muchas herramientas y plugins para extender su funcionalidad, para monitorear

~~~yml
version: '3.9'
services:
  rabbitmq:
    container_name: rabbitmq
    image: rabbitmq:3.12.4-management-alpine
    ports:
      - 5672:5672
      - 15672:15672 # para el management desde el navegador
    environment:
      - RABBITMQ_DEFAULT_PASS=admin
      - RABBITMQ_DEFAULT_USER=admin
~~~

- Corriendo la imagen de Docker, coloco en el navegador htt://localhost:15672
- Pongo user admin, password: admin
- Puedo ver que Prometheus está en 15692, lo veremos más adelante (no expongo el cuerpo en el archivo .yml)
- Los exchanges son los diferentes puentes por los que podemos pasar
- Usaremos **AMQP** que srive por defecto
- Puedo crear mi propio exchange
- Desde el management puedo crear usuarios, configuraciones varias, etc
- RabbitMQ Permite desacoplamiento entre microservicios y una alta escabilidad
- Si tengo una data JSON, esta va a venir en formato Buffer
  - Esto quiere decir que para mandar data voy a tener que serializar la data a string y luego convertirla a Buffer
- Permite un enrutamiento flexible
------

## Comenzando el proyecto

- Normalmente se usa una infraestructura ya creada
- Vamos a configurarlo de manera manual, da mucho control pero se complica a medida que se avanza
- La forma recomendable para hacer esto es con **Nest**
- **AMQP** es la librería que usaremos para usar RabbitMQ

> npm i amqplib

- La versión 1.0 no tiene nada que ver con la 0.9.1 que es la que usaremos (la recomendable)
- En la documentación veremos que hay una API que funciona con promesas (callbacks) y otra API que lo hace con async await
- En el index del eventbroker tengo expuesto el endpoint post "/events" con el controlador
- En el controlador están los enums y los llamados a los microservicios
- Puedo trabajar de otra manera con amqp
- En lugar de tener el código acoplado a endpoints (que pueden cambiar) me comunico directamente con los eventos usando RabbitMQ
----

## Capturando el evento

- Hago una copia del proyecto de Node para poder modificarlo para usar RabbitMQ
- Voy al api-gateway y lo pongo en marcha
- En el api-gateway tengo el service que me devuelve un string
- Hago la query en Apollo Server localhost:3000
- Lo tengo en roots/Query

~~~gql
query ExampleQuery{
  service # devuelve "API GATEWAY"
}
~~~

- Puedo quitar la capa de controladores en el eventBroker y hacer la lógica directamente desde allí
- event-broker.controller
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
    const products = await getAllProducts(); //quitar este controlador y añadir aquí la lógica

    return res.status(200).json({
      data: products,
    });
  }

  if (event === UsersEvent.GET_USERS) {
    const users = await getAllUsers();//quitar este controlador y añadir aquí la lógica

    return res.status(200).json({
      data: users,
    });
  }

  if (event === SalesEvent.CREATE_SALE) {
    const sale = await createSale(data);//quitar este controlador y añadir aquí la lógica

    return res.status(200).json({
      data: sale,
    });
  }

  return res.status(404).json({
    message: "Event not found",
  });
};
~~~

- Borro todo y dejo solo esto

~~~js
import { Request, Response } from "express";


export const eventBrokerController = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  //console.log(event)

  return res.status(404).json({
    message: "Event not found",
  });
};
~~~

- Compruebo que recibo el event con una query de CREATE_SALE, por ejemplo
- Debo tener los microservicios correspondientes corriendo

~~~gql
mutation($input: EventBrokerInput!){
  sendEvent(input: $input){
    ... on Sales
      sales{
          product{
            name
            price
            description
          }
          quantity
          price{
            total
            unit
          }
      }
      
  }
}

##VARIABLES

{
  "input":{
    "event": "CREATE_SALE",
    "queryData": {
      "sales":{
        "quantity": 10 #con esto debería ser suficiente
      }
    },
    "type": "sale"
  }
}
~~~

- Usaremos este CREATE_SALE para generar una cola con RabbitMQ que todavía no vamos a conectar, pero lo visualizaremos en el panel de RabbitMQ
- RabbitMQ en el navegador

> localhost:15672 
-----

## Comunicar microservicios con queues

- Usaremos amqplib, lo instalamos en el event-broker
- Instalo los tipos también 
  
> npm i - D @types/amqplib @types/cors @types/dotenv

- Debo crear la conexión con amqplib 
- Para usar amqplib recuerda que debe de ser async
- Mi queue es el evento (string)
- Voy a tener que crear un canal de comunicación, una vez se termina la comunicación se destruye
- event-broker/src/controllers/eventBroker.controller

~~~js
import { Request, Response } from "express";
import amqplib from 'amqplib'

const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

export const eventBrokerController = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  const channel= await connection.createChannel()
  await channel.assertQueue(event)

  return res.status(404).json({
    message: "Event not found",
    event
  });
};
~~~

- Podría hacer la conexión por separado y trabajarlo con clases
- En el navegador con RabbitMQ veo que tengo la queue CREATE_SALE
- La variable de entrn AMQPLIB_URL es

> amqp://localhost

- La petición la estoy haciendo desde POSTMAN a POST localhost:3001/events pasándole en el body

~~~json
{
  "event": "CREATE_SALE",
  "data": {}

}
~~~

- De esta manera el eventBroker se conecta a rabbitMQ y no a diferentes puertos para extraer la data
- El eventBroker no necesita controladores, solo la conexión a rabbitMQ
- Sigo exponiendo el método POST a 3001/events pero internamente ya no llamo a otros endpoints
-----

## Consumir Queue

- Estos eventos pueden disparar excepciones
- Por ejemplo si no recibimos ningún evento

~~~js
import { Request, Response } from "express";
import amqplib from 'amqplib'

const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

export const eventBrokerController = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  if(!event){
    return res.status(500).json({
      message: "Event is required"
    })
  }
  const channel= await connection.createChannel()
  await channel.assertQueue(event)

  return res.status(404).json({
    message: "Event not found",
    event
  });
};
~~~

- Ahora los puertos expuestos de los microservicios ya dan igual
- Podemos hacer un endpoint para comprobar que el microservicio de Sales está vivo
- Las rutas me dan igual, me voy a manejar de otra manera con los eventos
- sales/src/index.ts

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import { SalesRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/healt", (req, res) => {
  res.send(`Sales Microservice is live on port: ${port}`);
});

//app.use("/sales", SalesRoutes); no necesito las rutas

app.listen(port, () => {
  console.log("Sales Microservice is running on port:", port);
});
~~~

- Instalo amqplib en sales
- En el event-broker/src/enums tengo todos los enums, incluido el de ventas
- Copio el enum de sales del event-broker y lo copio en src/enum/sales.enum.ts

~~~js
export enum SalesEvent {
  CREATE_SALE = "CREATE_SALE",
  UPDATE_SALE = "UPDATE_SALE",
  DELETE_SALE = "DELETE_SALE",
  GET_SALE = "GET_SALE",
  GET_SALES = "GET_SALES",
}
~~~

- Copio la conexión a rabbitMQ del eventBroker y la coloco también en el index.ts de Sales

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SalesRoutes } from "./routes";
import amqplib from 'amqplib'

dotenv.config();


const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Sales Microservice is alive on port: ${port}`);
});

//RabbitMQ
//creo un canal
const channel = await connection.createChannel()


//voy a necesitar un listener
//una vez obtengo el queue voy a consumirlo
await channel.consume(SalesEvent.CREATE_SALE, ()=>{
  console.log("consume CREATE_SALE")
}, noAck: true) //en true para que no almacene las peticiones

app.use("/sales", SalesRoutes);

app.listen(port, () => {
  console.log("Sales Microservice is running on port:", port);
});
~~~

- Esto me devuelve un status 200 pero no está llegando la info
- Esto es porque en el eventBroker, tras el assertQueue(event) (tras afirmar la cola ), no estamos retornando nada
- Uso **sendToQueue** para mandar el evento y en el segundo parametro (content, tiene que ser un **buffer**) lo pongo en Buffer vacío
- event-broker/src/controllers/events.controller.ts

~~~js
import { Request, Response } from "express";
import amqplib from 'amqplib'

const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

export const eventBrokerController = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  if(!event){
    return res.status(500).json({
      message: "Event is required"
    })
  }

  try{
    const channel= await connection.createChannel()
  await channel.assertQueue(event)
                                        //new Buffer is deprecated
  await channel.sendToQueue(event, new Buffer(""))

  return res.status(404).json({
    message: "Event not found",
    event
  });

  }catch(error){
    return res.status(500).json({
      message: error.message
    })
  }
  
};
~~~

- En el controlador de sales necesito conectarme con el microservicio de usuarios y de productos
- Concretamente GET_USER y GET_PRODUCT
- sales/src/controllers/sales.controller

~~~js
import axios from "axios";
import { Request, Response } from "express";

//const eventBroker = axios.create({
  //baseURL: "http://localhost:3001",
//});

const sales: any[] = [];

export const getAll = (req: Request, res: Response) => {
  return res.status(200).json({ message: "OK", sales });
};

export const createSale = async (req: Request, res: Response) => {
  const { data } = req.body;

  const { quantity } = data;

  //const { data: user } = await eventBroker.post("/events", {
    //event: "GET_USERS",
  //});

  //const { data: product } = await eventBroker.post("/events", {
    //event: "GET_PRODUCTS",
  //});

  const sale = {
    user: user.data.users[0],
    product: product.data.products[0],
    quantity,
    price: {
      unit: product.data.products[0]?.price,
      total: product.data.products[0]?.price * quantity,
    },
  };

  sales.push(sale);

  return res.status(200).json({ message: "OK", sales: sale });
};
~~~

- Hago ciertas modificaciones y coloco data en duro por ahora
- No hay request ni response, solo la función

~~~js
import axios from "axios";
import { Request, Response } from "express";

//const eventBroker = axios.create({
 // baseURL: "http://localhost:3001",
//});


export const createSale = async () => {


const quantity = 10  

const sale = {
  quantity,
  price:{
    unit: 100,
    total: 100
  }
}


  sales.push(sale);

  return sales;
};
~~~

- LLamo a este createSale desde sales/src/index.ts en lugar del console.log

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SalesRoutes } from "./routes";
import amqplib from 'amqplib'

dotenv.config();


const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Sales Microservice is alive on port: ${port}`);
});

//RabbitMQ
//creo un canal
const channel = await connection.createChannel()


                                              //async, importante!!!
await channel.consume(SalesEvent.CREATE_SALE, async ()=>{
  
  const sale = await createSale()

console.log(`Sale: ${JSON.stringify(sale)}`) //convierto a string el objeto que he creado de sales

}, noAck: true) 

//app.use("/sales", SalesRoutes);

app.listen(port, () => {
  console.log("Sales Microservice is running on port:", port);
});
~~~

- Esto así solo me sirve para comprobar que se realizó la petición, pero no hay data
- Puedo crear otros consumidores con **SalesEvent.GET_SALES y en const sale = await getAll()**
------

## Enviar y recibir data por queue

- Quiero pasarle la quantity y el price a createSale
- sales/src/controllers/sales.controller

~~~js
export const createSale = async (quantity: number = 10, price:number = 120) => {


const quantity = 10  

const sale = {
  quantity,
  price:{
    unit: price,
    total: price * quantity
  }
}


  sales.push(sale);

  return sales;
};
~~~

- Cómo hago para captarlos en el event-broker para pasárselos a createSale
- event-broker/src/controllers/eventBroker.controller.ts
~~~js
import { Request, Response } from "express";
import amqplib from 'amqplib'

const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

export const eventBrokerController = async (req: Request, res: Response) => {
  const { event, data } = req.body;

  if(!event){
    return res.status(500).json({
      message: "Event is required"
    })
  }

  try{
    const channel= await connection.createChannel()
  await channel.assertQueue(event)
                                        //en caso de venir la data vacía devolverá un objeto vacío
  await channel.sendToQueue(event, Buffer.from( JSON.stringify(data || {})))// así no devuelve undefined

  return res.status(404).json({
    message: "Event not found",
    event
  });

  }catch(error){
    return res.status(500).json({
      message: error.message
    })
  }
  
};
~~~

- No lo estoy recibiendo porque en el queue tenemos un onMessage: msg
- Lo puedo capturar mientras lo consumo. El content es un buffer
- sales/src/controllers/sales.controller.ts

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SalesRoutes } from "./routes";
import amqplib from 'amqplib'

dotenv.config();


const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Sales Microservice is alive on port: ${port}`);
});

//RabbitMQ
//creo un canal
const channel = await connection.createChannel()


                                              //aquí capturo el msg!!
await channel.consume(SalesEvent.CREATE_SALE, async (msg)=>{

  console.log(msg.content) //recibo un buffer
  
  
  //const sale = await createSale()

//console.log(`Sale: ${JSON.stringify(sale)}`) 

}, noAck: true) 

//app.use("/sales", SalesRoutes);

app.listen(port, () => {
  console.log("Sales Microservice is running on port:", port);
});
~~~

- Puedo usar toString() para consumir este Buffer

~~~js
console.log(JSON.parse(msg.content.toString())) 
//esto devuelve un json con el price y la quantity
~~~

- Para usar la sale que venga con createSale

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SalesRoutes } from "./routes";
import amqplib from 'amqplib'

dotenv.config();


const connection = await amqp.connect({
  hostname: 'localhost',
  username: 'admin',
  password: 'admin'
})

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Sales Microservice is alive on port: ${port}`);
});

//RabbitMQ
//creo un canal
const channel = await connection.createChannel()


                                              //async, importante!!!
await channel.consume(SalesEvent.CREATE_SALE, async (msg)=>{
  

  const data = JSON.parse(msg.content.toString())

  const sale = await createSale(data.quantity, data.price)

console.log(`Sale: ${JSON.stringify(sale)}`) //Ahora sale la data que le mando

}, noAck: true) 

//app.use("/sales", SalesRoutes);

app.listen(port, () => {
  console.log("Sales Microservice is running on port:", port);
});
~~~

- Esta no es la mejor forma de trabajar, es con fines didácticos
- Vamos con Nest!