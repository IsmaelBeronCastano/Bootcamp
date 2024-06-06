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

