import { Request, Response } from "express";
import { EmailDto } from "../../domain/dtos/email.dto";
import { EmailService } from "./email.service";

export class EmailController {
    constructor(private readonly emailService: EmailService) {}
    
    
     sendEmail=(req: Request, res:Response)=> {
        const email = req.body
        
        const [error, emailDto] = EmailDto.create(email)
        if(error) return res.status(400).json({error})

            console.log(emailDto)
        
        const sendEmail = EmailDto.toSendEmail(emailDto!)
        
            this.emailService.sendEmail(sendEmail)
                .then(email=> res.json(email))
                .catch(err=>console.log(err))
    }
}