import { envs } from './config/envs';
import { UserRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    routes: UserRoutes.routes,
  });

  server.start();
}