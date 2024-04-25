import { envs } from './config/envs';
import { MongoDBConnection } from './data/mongo/mongo-connection';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {

  await MongoDBConnection.connect({
    mongoUrl: envs.MONGO_STRING,
    dbName: envs.MONGO_DB_NAME

  })

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}