import { Router } from "express";
import { AuthRoutes } from "./auth/routes/auth.routes";

export class AppRoutes {

  static get routes(): Router{
    const router = Router()

    router.use('/api/v1/auth',AuthRoutes.routes)
    return router
  }
}