# Node TS File Upload

- Creo la carpeta presentation/file-upload con su controlador y sus rutas
- controller

~~~js
import { Request, Response } from "express"

export class FileUploadController{

    constructor(){}

    private handleError = (error:unknown, res: Response)=>{
        if(error instanceof Error){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }    

    public uploadFile=(req:Request, res: Response)=>{
        res.json({message: 'File uploaded successfully'})
    }
    
    public uploadMultipleFiles=(req:Request, res: Response)=>{
        res.json({message: 'Files uploaded successfully'})
    }
}
~~~

- routes

~~~js
import { Router } from 'express';
import { getEnabledCategories } from 'trace_events';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadController } from './file-upload.controller';


export class FileUploadRoutes {


  static get routes(): Router {
    
    const fileUploadController = new FileUploadController()
    const router = Router();
    

    router.post('single/:type', [AuthMiddleware.validateJWT], fileUploadController.uploadFile)
    router.post('multiple/:type', [AuthMiddleware.validateJWT], fileUploadController.uploadMultipleFiles)
    
    return router;
  }
}
~~~

- En AppRoutes

~~~js
import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';
import { FileUploadRoutes } from './file-upload/routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/categories', CategoryRoutes.routes)
    router.use('/api/file-upload', FileUploadRoutes.routes)

    return router;
  }
}
~~~
------

## FileUpload Service y Middleware

- Creo la carpeta uploads en la raiz con un archivo .gitkeep para que aunque esté vacía la carpeta siga estando ahi
- Creo el servicio de fileUpload
- Ocupo instalar dos paquetes: **uuid** (para ponerles id's a las imágenes) y **express-fileupload** (es un middleware)
- En **req.files** se guardan los archivos de la petición
- Para probarlo, voy a POSTMAN en body/form-data le pongo un nombre y selecciono de tipo File
  - En value selecciono la foto
  - Cuando solo subo un archivo me lo entrega en un objeto
  - Cuando subo varios los entrega en un array 
  - Esto lo corregiremos muy pronto

- El servicio

~~~js
export class FileuploadService{
    constructor(){}

    
    //para checkear que el folder donde se va a guardar la imagen existe
    private checkFolder(){}


    public uploadFile=(
        file: unknown, 
        folder: string, 
        validExtensions: string[]= ["png", "jpg", "jpeg", "gif"])=>{
        
    }

    public uploadMultipleFiles=(
        file: unknown[], 
        folder: string, 
        validExtensions: string[]=["png", "jpg", "jpeg", "gif"])=>{
        return ({message: 'File uploaded successfully'})
    }
}
~~~
----

## Movemos el archivo a su destino permanente

- Para transformar el objeto que me retorna cuando mando un solo archivo en un array vamos a hacer un middleware
- Como tipo del file a subir le pondremos UploadedFile de express-fileupload
- Cuando recibo el objeto de retorno, en mimetype recibo algo como image/png
  - De aquí puedo extraer la extensión de la foto

~~~js
import {UploadedFile} from 'express-fileupload'
import path from 'path'
import fs from 'fs'

export class FileuploadService{
    constructor(){}

    
    //para checkear que el folder donde se va a guardar la imagen existe
    private checkFolder(folderPath: string){
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath, {recursive: true})
        }
    }


    public uploadFile= async(
        file: UploadedFile, 
        folder: string, 
        validExtensions: string[]= ["png", "jpg", "jpeg", "gif"])=>{
        
            try {
                const fileExtension = file.mimetype.split('/')[1]
                if(!validExtensions.includes(fileExtension)){
                    return ({error: 'Invalid file extension'})
                }
                const destination= path.resolve(__dirname, '../../../', folder)
                this.checkFolder(destination)

                file.mv(destination + `mi-imagen.${fileExtension}`) //no es el nombre final, solo un ejemplo
            } catch (error) {
                
            }
    }

    public uploadMultipleFiles=(
        file: UploadedFile[], 
        folder: string, 
        validExtensions: string[]=["png", "jpg", "jpeg", "gif"])=>{
        return ({message: 'File uploaded successfully'})
    }
}
~~~

- Inyecto el servicio en el controlador
- Debo crear la instancia y pasársela en el routes

~~~js
import { Router } from 'express';
import { FileUploadController } from './file-upload.controller';
import { FileuploadService } from '../services/file-upload.service';
import fileUpload from 'express-fileupload';


export class FileUploadRoutes {


  static get routes(): Router {

    const fileUploadService = new FileuploadService()
    const fileUploadController = new FileUploadController(fileUploadService)
    const router = Router();
    

    router.post('/single/:type', fileUpload(), fileUploadController.uploadFile)
    router.post('/multiple/:type', fileUpload(), fileUploadController.uploadMultipleFiles)
    
    return router;
  }
}
~~~

- En el controller

~~~js
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
        const files = req.files

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({error: 'No files were uploaded'})
        }

        const file = req.files.file as UploadedFile

        this.fileUploadService.uploadFile(file, 'uploads')
        .then((uploaded)=> res.json(uploaded))
        .catch((error)=> this.handleError(error, res))
    }
    
    public uploadMultipleFiles=(req:Request, res: Response)=>{
        res.json({message: 'File uploaded successfully'})
    }
}
~~~
----

## Cambiar nombre archivo imagen

- Creo el adaptador uuid en /config

~~~js
import {v4 as uuidv4} from 'uuid';


export class Uuid{

    static v4 = () => uuidv4()

}
~~~

- En el FileUploadService inyecto el Uuid
- Ahora puedo crear el nombre con el id

~~~js
import {UploadedFile} from 'express-fileupload'
import path from 'path'
import fs from 'fs'
import { Uuid } from '../../config/uuid.adapter'

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
                    return ({error: 'Invalid file extension'})
                }
                const destination= path.resolve(__dirname, '../../../', folder)
                this.checkFolder(destination)

                const fileName = `${this.uuid()}.${fileExtension}` //creo el nombre con el id

                file.mv(`${destination}/${fileName}`) 

                return {fileName}
            } catch (error) {
                
            }
    }

    public uploadMultipleFiles=(
        file: UploadedFile[], 
        folder: string, 
        validExtensions: string[]=["png", "jpg", "jpeg", "gif"])=>{
        return ({message: 'File uploaded successfully'})
    }
}
~~~

- La idea del :type en la url es para indicar en que carpeta o subcarpeta lo quiero almacenar
- Habrá que validarlo
---------

## Colocar archivo en subdirectorios

- El subdirectorio me lo dirán en la url /upload/single/**user**
- En el controller

~~~js
  public uploadFile=(req:Request, res: Response)=>{
        const type = req.params.type //uso type porque esa es la palabra que usé en el endpoint /:type
        const validTypes=['users', 'products', 'categories']

        if(!validTypes.includes(type)){
            return res.status(400).json({error: 'Invalid type'})
        }

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({error: 'No files were uploaded'})
        }

        const file = req.files.file as UploadedFile  //es .file porque yo le pongo ese nombre en POSTMAN al cargarlo

        this.fileUploadService.uploadFile(file, `uploads/${type}`)
        .then((uploaded)=> res.json(uploaded))
        .catch((error)=> this.handleError(error, res))
    }
~~~
-----

## Middleware de verificación de archivos

- req.files.file puede ser un UploadedFile o un arreglo de UploadedFile y eso me puede dar problemas, sobretodo en el de subida múltiple
- Además de mandar la foto en el req.body puedo mandar otra info como el nombre, o lo que quiera
- Un middleware no es más que una función que recibe la req y la res y la función next

~~~js
export class FileUploadMiddleware{
    public static containFiles = (req: any, res: any, next: any) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded' });
        }
        const type = req.params.type;
        const validTypes = ['users', 'products', 'categories'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }
        
        //si no es un arreglo significa que es el objeto de una sola imagen
        if(!Array.isArray(req.files.file)){
            req.body.files= [req.files.file]
        }else{
            req.body.files= req.files.file //es .file porque yo en POSTMAN le estoy poniendo de nombre file
        }

        next();
    }
    
}
~~~

- Hago uso del middleware en routes

~~~js
import { Router } from 'express';
import { FileUploadController } from './file-upload.controller';
import { FileuploadService } from '../services/file-upload.service';
import fileUpload from 'express-fileupload';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';


export class FileUploadRoutes {


  static get routes(): Router {

    const fileUploadService = new FileuploadService()
    const fileUploadController = new FileUploadController(fileUploadService)
    const router = Router();

    router.use(fileUpload()) //coloco esto antes del middleware, si no no carga los archivos!!
    router.use(FileUploadMiddleware.containFiles)
    

    router.post('/single/:type', fileUploadController.uploadFile)
    router.post('/multiple/:type', fileUploadController.uploadMultipleFiles)
    
    return router;
  }
}
~~~

- Modifico el controller, ahora tengo el file en req.body.files.at(0)

~~~js
public uploadFile=(req:Request, res: Response)=>{
    const type = req.params.type //uso type porque esa es la palabra que usé en el endpoint /:type
    const validTypes=['users', 'products', 'categories']

    if(!validTypes.includes(type)){
        return res.status(400).json({error: 'Invalid type'})
    }

    const file = req.body.files.at(0) as UploadedFile //ahora tengo el file en un arreglo, puedo usar corchetes o .at

    this.fileUploadService.uploadFile(file, `uploads/${type}`)
    .then((uploaded)=> res.json(uploaded))
    .catch((error)=> this.handleError(error, res))
}
~~~
--------

## Carga múltiple

- Puedo evaluar el type (la carepta donde irá la imagen que introduzco como param) mediante un middleware o una función
- La caraga múltiple es muy parecida a la individual, solo cambia la definición de file a UploadedFile[] y el método del servicio
- **Recuerda** que el método del servicio tiene que ser async pero en el controller procuramos no usar async y await

~~~js
public uploadMultipleFiles=(req:Request, res: Response)=>{
    const type = req.params.type //uso type porque esa es la palabra que usé en el endpoint /:type
    const validTypes=['users', 'products', 'categories']

    if(!validTypes.includes(type)){
        return res.status(400).json({error: 'Invalid type'})
    }

    const files = req.body.files as UploadedFile[] //ahora tengo el file en un arreglo, puedo usar corchetes o .at

    this.fileUploadService.uploadMultipleFiles(files, `uploads/${type}`)
    .then((uploaded)=> res.json(uploaded))
    .catch((error)=> this.handleError(error, res))
}
~~~

- En el servicio

~~~js
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
~~~
--------

## Middleware para verificar el archivo

- Middleware

~~~js
import { NextFunction, Request, Response } from "express";

export class ValidTypesMiddleware{
    static validTypes= (req: Request, res: Response, next: NextFunction)=>{
        const type= req.params.type
        const validTypes=['users', 'products', 'categories']

        if(!validTypes.includes(type)){
            return res.status(400).json({error: 'Invalid type'})
        }
        next()

    }
}
~~~

- Si quiero pasarle como argumento los types para hacerlo reutilizable, lo puedo hacer de esta forma

~~~js
static validTypesDinamic= (validTypes: string[])=> (req: Request, res: Response, next: NextFunction)=>{
    const type= req.params.type

    if(!validTypes.includes(type)){
        return res.status(400).json({error: 'Invalid type'})
    }
    next()

}
~~~

- Lo implemento en routes

~~~js
router.use(ValidTypesMiddleware.validTypes)

//Si quisiera usar la forma dinámica
router.post('/multiple/:type', ValidTypesMiddleware.validTypesDinamic(['products', 'users', 'categories']), fileUploadController.uploadMultipleFiles)
~~~

- Ocurre una cosa! El type me da undefined si uso app.use con el método dinámico
- Si lo coloco en el .post del múltiple no me da problema
- Porque en la ruta **YA TENGO EL REQ.PARAMS** pero cuando trabajo con el middleware de esta manera no se con que request estoy trabajando en este momento
- Puedo arreglarlo con req.url para extraer el type de la url

~~~js
static validTypesDinamic= (validTypes: string[])=> (req: Request, res: Response, next: NextFunction)=>{
    const type= req.url.split('/')[2] ?? ""

    if(!validTypes.includes(type)){
        return res.status(400).json({error: 'Invalid type'})
    }
    next()

}
~~~
----

## Retornar una imagen

- En el endpoint /images buscaré por type (/users, por ejemplo) seguido del id de la imagen

~~~js
import { Router } from "express";
import { ValidTypesMiddleware } from "../presentation/middlewares/types.middleware";
import { ImageController } from "./images.controller";

export class ImageRoutes{

    static get routes(): Router{

        const router = Router()

        router.get('/:type/:id', ImageController.getImageById)

        return router
    }
}
~~~

- En el controlador haré todo el código en un método estático (sin inyección de dependencias ni servicio)

~~~js
import { Request, Response } from "express"
import path from "path"
import fs from 'fs'


export class ImageController{

    public static getImageById = async (req:Request, res: Response)=>{
        const {type="", id=""} = req.params
        const filePath = path.resolve(__dirname, `../../uploads/${type}/${id}`)

        if(!fs.existsSync(filePath)){
        return res.status(400).json({error: 'Image not found'})
        }

        return res.sendFile(filePath)
    }
}
~~~

- En el router principal añado el router

~~~js
router.use('/api/images', ImageRoutes.routes)
~~~

