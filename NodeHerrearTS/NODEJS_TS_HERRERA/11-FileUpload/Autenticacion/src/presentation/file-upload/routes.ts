import { Router } from 'express';
import { FileUploadController } from './file-upload.controller';
import { FileuploadService } from '../services/file-upload.service';
import fileUpload from 'express-fileupload';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { ValidTypesMiddleware } from '../middlewares/types.middleware';


export class FileUploadRoutes {


  static get routes(): Router {

    const fileUploadService = new FileuploadService()
    const fileUploadController = new FileUploadController(fileUploadService)
    const router = Router();

    router.use(fileUpload())
    router.use(FileUploadMiddleware.containFiles)
    router.use(ValidTypesMiddleware.validTypes)
    

    router.post('/single/:type', fileUploadController.uploadFile)
    router.post('/multiple/:type', fileUploadController.uploadMultipleFiles)
    
    return router;
  }


}

