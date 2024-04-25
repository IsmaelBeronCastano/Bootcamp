// Add the following line to import the 'fs' module
import fs from 'fs'
import Mail from 'nodemailer/lib/mailer'
import path from 'path'
import nodemailer from 'nodemailer'
import { envs } from '../../config/envs'

interface SendEmailOptions{
    to: string | string[]
    subject: string
    htmlBody: string
    attachments?: Mail.Attachment[] | undefined;
}


export class EmailService{
    
    constructor(){ 
        
    }
    private transporter= nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth:{
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    
    
    async sendEmail(options: SendEmailOptions): Promise<boolean>{
        
        const {to="ismaelberoncastano@gmail.com", subject,htmlBody, attachments} = options
        
        
        const picturesMap = attachments?.map(picture=>{
            const { filename } = picture;
            let picturePath = path.join(__dirname, '..', '..', 'images', filename as string);
        
            picture.content = fs.readFileSync(picturePath).toString('base64');
            picture.encoding = 'base64';
            picture.cid = (filename as string)?.split('.')[0];

      
            return {
                filename,
                content: picture.content,
                path: picturePath,
                cid: picture.cid,
                encoding: picture.encoding
            }
        })

        

            try {
                const sentInformation = await this.transporter.sendMail({
                    to,
                    subject,
                    html: htmlBody,
                    attachments: picturesMap
                })

                console.log(sentInformation)
                // this.logRepository.saveLog(log)

                return true
            } catch (error) {

           
             console.log(error)
                return false
            }
    }

}