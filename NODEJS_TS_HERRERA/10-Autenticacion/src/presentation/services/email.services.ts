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
        senderEmailPassword: string
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

    async sendemailWithFileSystemLogs(to: string | string[]){ 
            const subject= 'Logs del servidor'
            const htmlBody=`
            <h3>Logs del sistema</h3>
            <p>Desde sendEmailWithFileSystem</p>
            `

        const attachments: Attachment[]= [
            {filename: 'logs-all.log', path: './logs/logs-all.log'},
            {filename: 'logs-high.log', path: './logs/logs-high.log'},
            {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
        ]

        
        return this.sendEmail({to, subject, attachments, htmlBody})
    }

}