import { Application } from "express";
import { productsRoutes } from "./routes/products.routes";

export const appRoutes = (app: Application)=>{
    app.use('/products', productsRoutes.routes())
}