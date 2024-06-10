import { POST, route } from "awilix-express";
import { Request, Response } from "express";
import { BaseController } from "../common/controllers/base.controller";
import { IdentityService } from "../services/identity.service";
import { createUserDto } from "../common/dtos/identity.dto";

@route('/auth')
export class IdentityController extends BaseController{
    constructor(private identityService: IdentityService){
        super()
    }

    
    @route('/create')
    @POST()
    async create(req: Request, res: Response){
        try {
            await this.identityService.create({
                email: req.body.email,
                password: req.body.password
            } as createUserDto)

            res.status(201)
            res.send()

            
        } catch (error) {
            this.handleException(error, res)
        }
    }

    @route('/authenticate')
    @POST()
    async authenticate(req: Request, res: Response){
        try {

            const result = await this.identityService.authenticate(
                req.body.email, req.body.password
            )

            res.send(result)
            
        } catch (error) {
            this.handleException(error, res)            
        }
    }

}