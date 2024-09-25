import { Application } from "express";
import { userRoutes } from "./routes/users.routes";


const appRoutes=(app:Application)=>{
    app.use('/api/v1/user',userRoutes())
}

export {appRoutes}