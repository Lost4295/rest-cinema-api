import {Router} from "express"
import {UtilsController} from "../controllers/UtilsController"

export const utilsRoutes = Router()

const utilsController = new UtilsController()

utilsRoutes.get("/", utilsController.baseRoute)
