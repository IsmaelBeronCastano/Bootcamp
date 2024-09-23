import { Application } from "express"
import { usersRouter } from "./routes/users.routes"


export const appRoutes = (app: Application)=>{
    const BASE_PATH = '/user'

    app.use(BASE_PATH, usersRouter.routes())

}