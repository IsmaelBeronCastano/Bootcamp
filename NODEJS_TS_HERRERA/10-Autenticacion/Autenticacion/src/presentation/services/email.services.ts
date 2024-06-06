import nodemailer, { Transporter } from 'nodemailer'



interface SendEmailOptions{
    to: string | string[]
    subject: string
    htmlBody: string
    attachments?: Attachment[]
}

interface Attachment{
    filename?: string
    path?: string
}

export class EmailService{
    
    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
        private readonly postToProvider: boolean
    ){  
        this.transporter= nodemailer.createTransport({
            service: mailerService,
            auth:{
                user: mailerEmail,
                pass: senderEmailPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendEmail(options: SendEmailOptions): Promise<boolean>{

        const {to, subject,htmlBody, attachments=[]} = options

            try {

                    if(!this.postToProvider) return true 

                const sentInformation = await this.transporter.sendMail({
                    to,
                    subject,
                    html: htmlBody,
                    attachments
                })

                console.log(sentInformation)
                return true
            } catch (error) {
                console.log(error)
                return false
            }
    }



}