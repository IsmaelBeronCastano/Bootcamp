import {Request, Response} from 'express'
import { GET, POST, route } from "awilix-express";
import { BaseController } from "../common/controllers/base.controller";
import { MovementService } from "../services/movement.service";
import { MovementCreateDto } from '../dtos/movement.dtos';

@route('/movement')
export class MovementController extends BaseController{
    constructor(private readonly movementService: MovementService){
        super()
    }

    @GET()
    public async all(req:Request, res:Response){

        try {
            res.send(
                await this.movementService.all()
            )
        } catch (error) {
            this.handleException(error, res)
        }
    }
    @route('/:id')
    @GET()
    public async find(req:Request, res:Response){
        try {
            const id = req.params.id
            const result =  await this.movementService.find(+id)
            
            if(result){
                res.send(result)

            }else{
                res.status(404)
                res.send()
            }

            
        } catch (error) {
            this.handleException(error, res)
        }
    }

    @POST()
    public async store(req:Request, res: Response){
        try {
            await this.movementService.store({
                user_id: req.body.user_id,
                amount: req.body.amount,
                type: req.body.type
            } as MovementCreateDto)
    
            res.send() 
            
        } catch (error) {
            this.handleException(error, res)
        }
    }
}