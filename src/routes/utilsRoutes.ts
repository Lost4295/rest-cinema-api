import {Router} from "express"
import {UtilsController} from "../controllers/UtilsController"
import {
    adminAuthMiddleware,
    classicAuthMiddleware,
    employeeAuthMiddleware,
    superAdminAuthMiddleware
} from "../middleware/auth"
import {canOpen, isOpen} from "../middleware/open"


const utilsController = new UtilsController()
export const utilsRoutes = Router()

utilsRoutes.get("/", utilsController.baseRoute)


export const testUtilsRoutes = Router()

testUtilsRoutes.get("/", utilsController.ok)
testUtilsRoutes.get("/test-classic", classicAuthMiddleware, utilsController.ok)
testUtilsRoutes.get("/test-employee", employeeAuthMiddleware, utilsController.ok)
testUtilsRoutes.get("/test-admin", adminAuthMiddleware, utilsController.ok)
testUtilsRoutes.get("/test-super-admin", superAdminAuthMiddleware, utilsController.ok)
testUtilsRoutes.get("/test-is-open", isOpen, utilsController.ok)
testUtilsRoutes.get("/test-can-open", canOpen, utilsController.ok)

