# Node TS File Upload

- Creo la carpeta presentation/file-upload con su controlador y sus rutas
- controller

~~~js
import { Request, Response } from "express"

export class FileUploadController{

    constructor(){}

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }    

    public uploadFile=(req:Request, res: Response)=>{
        res.json({message: 'File uploaded successfully'})
    }
}
~~~

- routes

~~~js
import { Router } from 'express';
import { getEnabledCategories } from 'trace_events';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadController } from './file-upload.controller';


export class FileUploadRoutes {


  static get routes(): Router {
    
    const fileUploadController = new FileUploadController()
    const router = Router();
    

    router.post('/', [AuthMiddleware.validateJWT], fileUploadController.uploadFile)
    
    return router;
  }
}
~~~

- En AppRoutes

~~~js
import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';
import { FileUploadRoutes } from './file-upload/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/categories', CategoryRoutes.routes)
    router.use('/api/file-upload', FileUploadRoutes.routes)

    return router;
  }
}
~~~

