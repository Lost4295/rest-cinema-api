import { Router } from "express"
import { AuthController } from "../controllers/auth/AuthController"
import { classicAuthMiddleware } from "../middleware/auth"

export const authRoutes = Router()

const authController = new AuthController()

authRoutes.post("/login", authController.login)
authRoutes.post("/register", authController.register)
authRoutes.get("/logout", classicAuthMiddleware, authController.logout)
authRoutes.get("/refresh-token", authController.refreshToken)
