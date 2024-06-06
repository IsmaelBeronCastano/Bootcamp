import { Router } from "express";
import { ValidTypesMiddleware } from "../presentation/middlewares/types.middleware";
import { ImageController } from "./images.controller";

export class ImageRoutes{

    static get routes(): Router{

        const router = Router()

        router.get('/:type/:id', ImageController.getImageById)

        return router
    }
}