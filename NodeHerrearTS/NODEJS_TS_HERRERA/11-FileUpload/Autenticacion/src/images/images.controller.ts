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