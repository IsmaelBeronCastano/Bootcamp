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
}