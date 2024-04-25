import { envs } from './config/envs';
import { MongoDatabase } from './data/mongo-connection';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {

  await MongoDatabase.connect(
    {
        mongoUrl:envs.MONGO_STRING, dbName: envs.MONGO_DB
    }) 

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}