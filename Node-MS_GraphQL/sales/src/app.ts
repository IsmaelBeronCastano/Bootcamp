import { envs } from './config/envs';
import { SalesRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    routes: SalesRoutes.routes,
  });

  server.start();
}