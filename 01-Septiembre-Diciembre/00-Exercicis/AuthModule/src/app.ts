import { envs } from "./config/envs"
import { MongoConnection } from "./data/mongo/mongo.connection"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server.new"


(async()=>{
  main()
})()


async function main (){

  await MongoConnection.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.DB_NAME
  }) 
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  })

  server.start()
}