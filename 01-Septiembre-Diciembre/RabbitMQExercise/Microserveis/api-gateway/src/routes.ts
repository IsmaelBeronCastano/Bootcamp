import { Application } from "express"

import { productsRoutes } from "./api/routes/products.routes"


const BASE_PATH= '/api/gateway/v1'

export const appRoutes=(app: Application)=>{

    app.use(BASE_PATH, productsRoutes.routes())

}