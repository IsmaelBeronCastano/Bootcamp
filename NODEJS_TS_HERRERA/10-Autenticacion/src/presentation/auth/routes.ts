import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';
import { envs } from '../../config/envs';
import { EmailService } from '../services/email.services';



export class AuthRoutes {


  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(envs.MAILER_SERVICE,envs.MAILER_EMAIL,envs.MAILER_SECRET_KEY, envs.SEND_EMAIL)
    const authService = new AuthService(emailService)
    const controller = new AuthController(authService);
    
   router.post('/login', controller.loginUser)
   router.post('/register', controller.registerUser)
   router.get('/validate-email/:token', controller.validateEmail)



    return router;
  }


}

