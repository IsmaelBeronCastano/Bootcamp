import {UploadedFile} from 'express-fileupload'
import path from 'path'
import fs from 'fs'
import { Uuid } from '../../config/uuid.adapter'
import { CustomError } from '../../domain'

export class FileuploadService{
    constructor(
        private readonly uuid = Uuid.v4
    ){}

    
    //para checkear que el folder donde se va a guardar la imagen existe
    private checkFolder(folderPath: string){
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath, {recursive: true})
        }
    }


    public uploadFile=async(
        file: UploadedFile, 
        folder: string, 
        validExtensions: string[]= ["png", "jpg", "jpeg", "gif"])=>{
        
            try {
                const fileExtension = file.mimetype.split('/')[1]
                if(!validExtensions.includes(fileExtension)){
                    return CustomError.badRequest('Invalid file extension')
                }
                const destination= path.resolve(__dirname, '../../../', folder)
                this.checkFolder(destination)

                const fileName = `${this.uuid()}.${fileExtension}` //creo el nombre con el id

                file.mv(`${destination}/${fileName}`) 

                return {fileName}
            } catch (error) {
                console.log(error)
            }
    }

    public uploadMultipleFiles= async(
        files: UploadedFile[], 
        folder: string, 
        validExtensions: string[]=["png", "jpg", "jpeg", "gif"])=>{
        
            const fileNames = await Promise.all(
                files.map(async(file)=>{
                    return await this.uploadFile(file, folder, validExtensions)
                })
            )
            return fileNames
    }
}