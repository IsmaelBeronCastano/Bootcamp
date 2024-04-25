import { Attachment } from "nodemailer/lib/mailer";
import { Address } from "../models/model";
import path from 'path'
import fs from 'fs'
import internal from "stream";


export interface Picture{
    filename: string ,
    content?: string | Buffer | internal.Readable| undefined,
    path?: string
    cid?: string 
    encoding?: string 

}


export class EmailDto{

    private constructor(
        public title: string,
        public body: string,
        public address: Address,
        public createdAt: Date,
        public pictures?: Picture[]
    ){}

    static create(object:{[key:string]:any}):[string?, EmailDto?] {
        let {title, body, address, pictures=[], createdAt} = object;
        createdAt = new Date()
        if(!title) return ["El título es obligatorio", undefined];
        if(title.length < 6) return ["El título es demasiado corto", undefined];
        if(title.length > 30) return ["El título es demasiado largo", undefined];
        if(typeof title !== "string") return ["El título debe ser un string", undefined];

        if(!body) return ["El mensaje es obligatorio", undefined];
        if(title.length < 6) return ["El mensaje es demasiado corto", undefined];
        if(typeof body !== "string") return ["El mensaje debe ser un string", undefined];


        if(!address) return ["la dirección es obligatoria", undefined];
       
        if(!pictures) return ["Al menos una foto es obligatoria", undefined];

  
        return [undefined, new EmailDto(title, body, address, createdAt, pictures)];
    }

    static toSendEmail(email: EmailDto){
        const {title, body, address, pictures, createdAt} = email
        let to="ismaelberoncastano@gmail.com"
       
        pictures?.map(picture=>(
        picture.cid = picture.filename.split('.')[0],
        picture.filename
       ))
        

        const subject = email.title;
        const htmlBody = `
        <h1> Este es un mensaje dirigido a </h1>
        <p>En la calle ${address.street} de la ciudad/pueblo de ${address.city} en la comunidad de ${address.state} sucede esta situación</p>
        <p>${body}</p>
        <p>Adjunto las fotografías que he podido realizar</p>
        ${pictures?.map(picture=>`<img src="cid:${picture.cid}" alt="${picture.filename}" />`)}
        <p>Gracias por su atención!</p>
        `

        return {
            to,
            subject,
            htmlBody,
            attachments: pictures
        }
    }
    
}