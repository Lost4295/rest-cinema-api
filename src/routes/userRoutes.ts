import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { adminAuthMiddleware, classicAuthMiddleware } from "../middleware/auth"

export const userRoutes = Router()

const userController = new UserController()

userRoutes.get("/", adminAuthMiddleware, userController.getAll)
userRoutes.get("/profile", classicAuthMiddleware, userController.getProfile)
userRoutes.put("/password", classicAuthMiddleware, userController.updatePassword)
userRoutes.post("/", adminAuthMiddleware, userController.createUserWithRole)
userRoutes.delete("/:id", adminAuthMiddleware, userController.deleteUser)
userRoutes.get("/credit",adminAuthMiddleware, userController.creditMoney)
userRoutes.get("/debite",adminAuthMiddleware, userController.debiteMoney)
userRoutes.get("/mytransaction",adminAuthMiddleware,userController.getMyTransaction)
userRoutes.get("/transactions",adminAuthMiddleware,userController.getAllTransaction)
