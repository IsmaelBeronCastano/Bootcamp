import { Router } from "express";
import controller from '../controllers/users.controller'


const router : Router = Router()
   
const userRoutes = (): Router=>{
    router.get('/get-user', controller.getUser)
    router.post('/create-user', controller.createUser)
    router.put('/update-user', controller.updateUser)
    router.delete('/delete-user', controller.deleteUser)
    return router
}

export {userRoutes}

