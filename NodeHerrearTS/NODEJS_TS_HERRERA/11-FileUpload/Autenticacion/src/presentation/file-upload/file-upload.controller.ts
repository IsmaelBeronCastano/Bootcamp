import { Request, Response } from "express"
import { FileuploadService } from "../services/file-upload.service"
import { UploadedFile } from "express-fileupload"



export class FileUploadController{

    constructor(
        private readonly fileUploadService: FileuploadService
    ){}

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }    

    public uploadFile=(req:Request, res: Response)=>{
        const type = req.params.type //uso type porque esa es la palabra que usé en el endpoint /:type

        const file = req.body.files.at(0) as UploadedFile //ahora tengo el file en un arreglo, puedo usar corchetes o .at

        this.fileUploadService.uploadFile(file, `uploads/${type}`)
        .then((uploaded)=> res.json(uploaded))
        .catch((error)=> this.handleError(error, res))
    }
    
    public uploadMultipleFiles=(req:Request, res: Response)=>{
        const type = req.params.type //uso type porque esa es la palabra que usé en el endpoint /:type

        const files = req.body.files as UploadedFile[] //ahora tengo el file en un arreglo, puedo usar corchetes o .at

        this.fileUploadService.uploadMultipleFiles(files, `uploads/${type}`)
        .then((uploaded)=> res.json(uploaded))
        .catch((error)=> this.handleError(error, res))
    }


}