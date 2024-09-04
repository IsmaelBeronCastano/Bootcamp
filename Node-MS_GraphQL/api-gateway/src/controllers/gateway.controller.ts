import axios from "axios";
import { Request, Response } from "express";

export class gatewayController {

    constructor(){}

    static async getAll(req: Request, res: Response){

        const {event, data: requestData} = req.body

        if(!event){

            return res.status(400).json({message: "Event is required"})
        }        
      
          try {
            const {data} = await axios.post("http://localhost:3001/events",{
              requestData,
              event
            })
           
            return res.status(200).json({
              message: "Success!!",
              data
            })

          } catch (error) {
            return res.status(500).json({
              message: "Error gateway",
              
            })       
          }
        }
}