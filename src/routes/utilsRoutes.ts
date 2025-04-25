import {Router} from "express"
import {UtilsController} from "../controllers/UtilsController"


const utilsController = new UtilsController()
export const utilsRoutes = Router()

utilsRoutes.get("/", utilsController.baseRoute)


export const testUtilsRoutes = Router()

testUtilsRoutes.get("/", utilsController.baseRoute)
