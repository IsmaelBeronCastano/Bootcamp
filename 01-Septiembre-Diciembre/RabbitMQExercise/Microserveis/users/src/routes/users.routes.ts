import { Router } from "express";
import usersController from '../controllers/users.controller'

export class UsersRouter{

    private router: Router
    
    constructor(){
        this.router = Router()
    }

    public routes (){
        this.router.get('/get-user', usersController.getUser)
        this.router.get('/get-users', usersController.getUsers)
        this.router.post('/create-user', usersController.createUser)
        this.router.put('/update-user', usersController.updateUser)
        this.router.delete('/delete-user', usersController.deleteUser)

        return this.router
    }
}

export const usersRouter: UsersRouter = new UsersRouter()