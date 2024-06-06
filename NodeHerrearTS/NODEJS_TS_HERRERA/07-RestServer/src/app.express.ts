import { envs } from "./config/env";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async()=>{

    main();
})()


function main (){

    const server = new Server({
        PORT: envs.PORT,
        PUBLIC_PATH: envs.PUBLIC_PATH,
        routes: AppRoutes.routes
    })

    server.start()

}