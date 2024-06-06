export class FileUploadMiddleware{
    public static containFiles = (req: any, res: any, next: any) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded' });
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