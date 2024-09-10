# NODE MICROSERVICIOS GRAPHQL - 01 Introducción a Microservicios

- Tengo tres servers
  - Products
  - Sales
  - Users
- Ejemplo de products:

- src/controllers/products.controller.ts
 
~~~js
import { Request, Response } from "express";

export class ProductsController{

    constructor(){}

    public getAllProducts = async(req:Request,res:Response)=>{
        return res.status(200).json({
            message: "OK",
            data:{
                products:{
                    name: "Piedra de Móstoles",
                    price: 20000,
                    quantity: 1
                }
            }
        })
    }
}
~~~

- src/presentation/routes.ts

~~~js
import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';




export class ProductRoutes {



  static get routes(): Router {

    const router = Router();
    const productsController= new ProductsController()


    router.get('/all', productsController.getAllProducts)

    return router;
  }


}
~~~

- products/src/presentation/server.ts

~~~js
import express, { Router } from 'express';


interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {
    

    //* Middlewares
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use( "/api/v1/products", this.routes );

    

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}
~~~

- products/src/app.ts

~~~js
import { envs } from './config/envs';
import { ProductRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    routes: ProductRoutes.routes,
  });

  server.start();
}
~~~

- src/config/envs.ts

~~~js
import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

}
~~~

.env

~~~
PORT=3001
~~~

- Creo un api-gateway (otro módulo sin servicio, solo app, server y controller)
- **NOTA**: cada microservicio es un módulo ajeno al otro, con su propio json.config, .env, etc y su propio puerto de escucha
  - Haremos que ninguno se expongan al exterior, que el punto de entrada sea el api-gateway
- Creo un método post en el server de api-gateway
- gateway/src/presentation/server.ts

~~~js
  async start() {
    

    //* Middlewares
    this.app.use( express.json() ); //para trabajar con json en el body
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
    this.app.use(cors())

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use( "/api/v1", this.routes );

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    

    //ESTE SERÁ MI MICROSERVICIO
    this.app.post("/api/v1", gateWayController.getAll)

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }
~~~

- En el gateway.controller evalúo que venga el event
- Si el evento coincide con el string de PRODUCTS_GET_ALL uso axios para hacer la petición get al microservicio de products
- Si no capturo el error con un try catch (importante usar un try catch con axios en typeScript!)

~~~js
import axios from "axios";
import { Request, Response } from "express";

export class gatewayController {

    constructor(){}

    static async getAll(req: Request, res: Response){

        const {event} = req.body

        if(!event){

            return res.status(400).json({message: "Event is required"})
        } 
        
        if(event.trim()=== 'PRODUCTS_GET_ALL'){

            try {
            const {data} = await axios.get('http://localhost:3001/api/v1/products/all')
            res.status(200).json({
                message: "Success!",
                data
                
            })                
            } catch (error) {
              console.log(error)  
              return res.status(500).json({
                message: "Error with axios"
              })
            }
            }

    }
}
~~~

- En la petición con POSTMAN/THUNDERCLIENT apunto al gateway

~~~
http://localhost:3000/api/v1/all
~~~

- En el body coloco esto

~~~json
{
  "event": "PRODUCTS_GET_ALL"
}
~~~

- Me devuelve esto (apuntando al al endpoint del api-gateway donde hago un get con axios al microservcicio de products)

~~~json
{
  "message": "Success!",
  "data": {
    "message": "OK",
    "data": {
      "products": {
        "name": "Toyota",
        "price": 2000,
        "quantity": 1
      }
    }
  }
}
~~~

- El gateway sirve para verificar que traemos el evento y posiblemente la data
- Si hubiera que hacer todas estas verificaciones (con trim, etc) para cada evento sería muy tedioso
- Para ello usaremos un **Event Broker** donde recibir el PRODUCT_GET_ALL y similares y redirigir la petición al microservicio adecuado tan solo cambiando una parte de la url con axios
----

## Event Broker

- Creamos una carpeta independiente (fuera del API gateway y los microservicios)
- Puedo copiar el mismo api-gateway y renombrarlo a event-broker
- Le pongo el puerto 3001 y cambio el de products a 3002, y el resto
- El api-gateway se va a comunicar directamente con el event-broker
- Cambio el endpoint /all a events
- event-broker/src/presentation/server.ts

~~~js
import { Router } from 'express';
import { Eventontroller } from '../controllers/gateway.controller';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/events', EventBrokerController.getAll)


    return router;
  }

}
~~~

- En el controller desestructuro el event y la data (que puede o no venir)
- Creo un archivo enum para los GET_ALL_PRODUCTS y demás 
- event-broker/src/enums/products.enum.ts

~~~js
export enum ProductsEvent{
    CREATE_PRODUCT = 'CREATE_PRODUCT',
    UPDATE_PRODUCT = 'UPDATE_PRODUCT',
    DELETE_PRODUCT = 'DELETE_PRODUCT',
    GET_PRODUCT = 'GET_PRODUCT',
    GET_PRODUCTS = 'GET_PRODUCTS'
}
~~~

- Ahora puedo usar el enum para las peticiones en el event-broker
- Creo un products.controller.ts en controllers/event-broker/src/controllers

~~~js
import axios from "axios"


const productsApi = axios.create({
    baseURL: 'http://localhost:3002/products'
})

export const getAllProducts = async()=>{
    
    try {
        const {data} = await productsApi('/all')
        return data
        
    } catch (error) {
        console.log(error)
    }
 
}
~~~

- Por el momento no hago validaciones de la data
- En el event-broker.controller.ts llamo a la función

~~~js
import axios from "axios";
import { Request, Response } from "express";
import { ProductsEvent } from "../enums/products.enum";
import { getAllProducts } from "./products.controller";

export class EventBrokerController {

    constructor(){}

    static async getAll(req: Request, res: Response){
        const {data} = await getAllProducts()


    }
}
~~~

- En el api-gateway ahora debo hacer una petición post y pasarle la data y el event al event-broker
- Renombro data a requestData para evitar conflictos

~~~js
import axios from "axios";
import { Request, Response } from "express";

export class gatewayController {

    constructor(){}

    static async getAll(req: Request, res: Response){

        const {event, data: requestData} = req.body

        if(!event){

            return res.status(400).json({message: "Event is required"})
        }        
      
          try {
            const {data} = await axios.post("http://localhost:3001/events",{
              requestData,
              event
            })
            return res.status(200).json({
              message: "Success!!",
              data
            })

          } catch (error) {
            return res.status(500).json({
              message: "Error",
              error
            })       
          }
        }   
}
~~~

- La validación/elección del event ocurre en el event-broker.controller

~~~js
import { Request, Response } from "express";
import { getAllProducts } from "./products.controller";
import { ProductsEvent } from "../enums/products.enum";

export class EventBrokerController {

    constructor(){}

    static async getAll(req: Request, res: Response){
        
        const {event, data}= req.body

        console.log(event)

        if(event === ProductsEvent.GET_PRODUCTS){
            
                const products = await getAllProducts()
                return res.status(200).json({
                    products
                })
                
            }

        res.status(404).json({
            message: "Event not found!"
        })



    }
}
~~~

- getAllProducts es donde llamo desde products.controller de api-gateway/src/controllers/products.controller.ts con axios al endpoint /all de products.controller (del microservicio products) (con un POST)

~~~js
import axios from "axios"


export const productsApi = axios.create({
    baseURL: 'http://localhost:3002/products'
})

export const getAllProducts = async()=>{
    
        const {data} = await productsApi.get('/all') //aqui uso get apuntando a products con un get

        return data
}
~~~


- Apunto con un POST a http://localhost:3000/api/v1/all
- Este es el endpoint de tipo post del api-gateway que llama al gatewayController
- api-gateway/src/presentation/routes.ts

~~~js
import { Router } from 'express';
import { gatewayController } from '../controllers/gateway.controller';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.post('/all', gatewayController.getAll)



    return router;
  }
}
~~~

- EN el gateway-controller apunto al event-broker
- El event-broker solo tiene el endpoint events que es de tipo post

~~~js
import axios from "axios";
import { Request, Response } from "express";

export class gatewayController {

    constructor(){}

    static async getAll(req: Request, res: Response){

        const {event, data: requestData} = req.body

        if(!event){

            return res.status(400).json({message: "Event is required"})
        }        
      
          try {
            const {data} = await axios.post("http://localhost:3001/events",{
              requestData,
              event
            })
            return res.status(200).json({
              message: "Success!!",
              data
            })

          } catch (error) {
            return res.status(500).json({
              message: "Error",
              error
            })       
          }
        } 
}
~~~

- event-broker/src/presentation/routes.ts

~~~js
import { Router } from 'express';
import { EventBrokerController } from '../controllers/event-broker.controller';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.post('/events', EventBrokerController.getAll)



    return router;
  }
}
~~~

- Este endpoint apunta al event-broker.controller, que es dónde evalúo el event y sirvo los productos llamando al getAllProducts del controlador de products que tengo en el event-broker

~~~js
import { Request, Response } from "express";
import { getAllProducts } from "./products.controller";
import { ProductsEvent } from "../enums/products.enum";

export class EventBrokerController {

    constructor(){}

    static async getAll(req: Request, res: Response){
        
        const {event, data}= req.body

        console.log(event)

        if(event === ProductsEvent.GET_PRODUCTS){
            
                const products = await getAllProducts()
                return res.status(200).json({
                    products
                })
                
            }

        res.status(404).json({
            message: "Event not found!"
        })

    }
}
~~~

- event-broker/src/controllers/products.controller.ts

~~~js
import axios from "axios"


export const productsApi = axios.create({
    baseURL: 'http://localhost:3002/products'
})

export const getAllProducts = async()=>{
    
        const {data} = await productsApi.get('/all') //llamo al endpoint de products con la instancia de axios

        return data
}
~~~
----

## Enumeración Eventos

- Generaremos el evento de usuarios y después crearemos la API
- En el event-broker/src/enums/users.enum.ts

~~~js
export enum UserEvent{
    CREATE_USER = 'CREATE_USER',
    UPDATE_USER = 'UPDATE_USER',
    DELETE_USER = 'DELETE_USER',
    GET_USER = 'GET_USER',
    GET_USERS = 'GET_USER'
}
~~~

- Creo también el controlador de users en el event-broker
- Usaremos funciones de flecha en vez de clases para los controllers
- El api-gateway está expuesto en http://localhost:3000/api/v1/all, desde aquí llamo al endpoint events del event-broker
- api-gatway.controller

~~~js
import axios from "axios";
import { Request, Response } from "express";

export class gatewayController {

    constructor(){}

    static async getAll(req: Request, res: Response){

        const {event, data: requestData} = req.body

        if(!event){

            return res.status(400).json({message: "Event is required"})
        }        
      
          try {
            const {data} = await axios.post("http://localhost:3001/events",{
              requestData,
              event
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
        }
}
~~~

- este all es el que expongo como POST en api-gateway/routes.ts

~~~js
import { Router } from 'express';
import { gatewayController } from '../controllers/gateway.controller';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.post('/all', gatewayController.getAll)
 



    return router;
  }

}
~~~

- En el event-broker hago las validaciones del event y llamo al controlador que se requiere

~~~js
import { Request, Response } from "express";
import { getAllProducts } from "./products.controller";
import { ProductsEvent } from "../enums/products.enum";
import { UserEvent } from "../enums/users.enum";
import { getAllUsers } from "./users.controller";

export class EventBrokerController {

    constructor(){}

    static async getAll(req: Request, res: Response){
        
        const {event, data}= req.body



        if(event === ProductsEvent.GET_PRODUCTS){
            
                const products = await getAllProducts()
                return res.status(200).json({
                    products
                })
                
            }

        if(event === UserEvent.GET_USERS){
            const users = await getAllUsers()

            return res.status(200).json({
                users
            })

        }
        res.status(500).json({
            message: "Internal Server Error - users"
        })
   }
}
~~~ 

- event-broker/src/controllers/user.controller.ts

~~~js
import axios from 'axios'


export const usersApi = axios.create({
    baseURL: 'http://localhost:3004/users'
})


export const UsersController =async ()=>{
     const getAllUsers = async()=>{
    
        const {data} = await usersApi.get('/all')

        return data
}

}
~~~

- En el server de users (por ejemplo), marco la ruta cuando ejecuto this.routes en el microservicio de users

~~~js
  this.app.use( "/users", this.routes );
~~~

- Y el /all lo marco en el routes.ts del microservicio de users

~~~js
router.post('/all', gatewayController.getAll)
~~~

- Conviene usar una función para pasar el event todo a mayúsculas antes de evaluarlo

~~~js
import axios from "axios";
import { Request, Response } from "express";

export class gatewayController {

    constructor(){}

    static async getAll(req: Request, res: Response){

        const {event, data: requestData} = req.body

        if(!event){

            return res.status(400).json({message: "Event is required"})
        }        
      
          try {
            const {data} = await axios.post("http://localhost:3001/events",{
              requestData,
              event: event.toUpperCase() //lo paso a mayúsculas
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
        }
}
~~~
----

## Microservicio Sales

- Creo en event-broker/src/enums/sales.enum.ts

~~~JS
export enum SalesEvent{
    CREATE_SALES = 'CREATE_SALES',
    UPDATE_SALES = 'UPDATE_SALES',
    DELETE_SALES = 'DELETE_SALES',
    GET_SALE = 'GET_SALE',
    GET_SALES = 'GET_SALES'
}
~~~

- A parte de crear una ruta para todos, quiero crear una ruta para crear una venta
- sales/src/presentation/routes.ts

~~~js
import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';


const salesController = new SalesController()

export class SalesRoutes {
     get routes(): Router {

    const router = Router();
    const productsController= new SalesController()


    router.get('/all', salesController.getAll)
    router.post('create', salesController.createSale)

    return router;
  }

}
~~~

- Apunto a http://localhost:3003/sales/create
- sales/src/controller/sales.controller.ts

~~~js
import { Request, Response } from "express";


interface Sale{
    user: Object,
    product: Object,
    quantity: number,
    price: number
}


export class SalesController{



    public  getAll= async(req:Request,res:Response)=>{
        return res.status(200).json({
            message: "OK",
            data:{
                sales:{
                    user: {},
                    product: {},
                    quantity: 0,
                    price: 0
                }
            }
        })
    }

    public createSale(req: Request, res: Response){
        const sales = []
        const {data}: any = req.body

        const {uid, product_id, quantity} = data

        const sale: Sale = {
            user: {},
            product: {},
            quantity,
            price: 0

        }
        sales.push(sale)
    
        return res.status(200).json({
            message: "OK!",
            sale
        })
        
        
    }
}
~~~

- En el sales server tengo

~~~js
import express, { Router } from 'express';
import cors from 'cors'

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {
    

    //* Middlewares
    this.app.use(cors())
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
    
    //* Public Folder
    this.app.use( express.static( this.publicPath ) );
    
    //* Routes
    this.app.use( "/sales", this.routes );

    

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}
~~~
------

## Comunicar varios microservicios

- Instalo axios en sales
- Genero una instancia de axios como eventBroker dentro de sales.controller
- Este código es algo complejo porque estoy usando la db en memoria
- **NOTA**: este código da error. No usaremos un broker de esta manera, en memoria...usaremos RabbitMQ

~~~js
import { Request, Response } from "express";
import axios from 'axios'



const eventBroker = axios.create({
    baseURL: 'http://localhost:3001'
})


export class SalesController{



    public  getAll= async(req:Request,res:Response)=>{
        return res.status(200).json({
            message: "OK",
            data:{
                sales:{
                    user: {},
                    product: {},
                    quantity: 0,
                    price: 0
                }
            }
        })
    }

    public async createSale(req: Request, res: Response){
        const sales = []
        const {data}: any = req.body

        const {uid, product_id, quantity} = data

        try {
            
            const {data: user} = await eventBroker.post(`/events`,{
                event: "GET_USERS",
    
            })
    
            const {data: product} = await eventBroker.post('/events',{
                event:'GET_PRODUCTS'
            })
    
            const sale = {
                user: user.users[0],
                product: product.products[0],
                quantity,
                price: {
                    unit: product[0]?.products.price, //puede no existir
                    total: product[0]?.products.price * quantity
                }
    
            }
            sales.push(sale)
        
            return res.status(200).json({
                message: "OK!",
                sale
            })
            
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "internal server error -sales.controller"
            })    
        }     
    }
}
~~~

- Cambio el SalesController a controladores de funciones de flecha

~~~js
import axios from "axios";
import { Request, Response } from "express";

const eventBroker = axios.create({
  baseURL: "http://localhost:3001",
});

const sales: any[] = [];

export const getAll = (req: Request, res: Response) => {
  return res.status(200).json({ message: "OK", sales });
};

export const createSale = async (req: Request, res: Response) => {
  const { data } = req.body;

  const { quantity } = data;

  const { data: user } = await eventBroker.post("/events", {
    event: "GET_USERS",
  });

  const { data: product } = await eventBroker.post("/events", {
    event: "GET_PRODUCTS",
  });

  const sale = {
    user: user.data.users[0],
    product: product.data.products[0], //el objeto que retorna es data.products
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
- **NOTA**: pasamos directamente a Node con GraphQL usando el código del curso
-----


