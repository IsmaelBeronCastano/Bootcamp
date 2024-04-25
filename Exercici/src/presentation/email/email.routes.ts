import { Router } from 'express';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';




export class EmailRoutes {


  static get routes(): Router {

    const router = Router();
    const emailService = new EmailService()
    const emailController = new EmailController(emailService)
    
   router.get('/email', emailController.sendEmail)



    return router;
  }


}

