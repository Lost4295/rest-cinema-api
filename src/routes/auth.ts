import {Router} from "express"
import {AuthController} from "../controllers/auth/AuthController"
import {classicAuthMiddleware} from "../middleware/auth"

export const authRoutes = Router()

const authController = new AuthController()

authRoutes.post("/login", authController.login)
authRoutes.post("/register", authController.register)
authRoutes.get("/logout", classicAuthMiddleware, authController.logout)
authRoutes.get("/refresh-token", authController.refreshToken)

export const testAuthRoutes = Router()
testAuthRoutes.post("/login", authController.login)
testAuthRoutes.post("/register", authController.register)
testAuthRoutes.get("/logout", authController.logout)
testAuthRoutes.get("/refresh-token", authController.refreshToken)
