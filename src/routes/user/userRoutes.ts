import { Router } from "express"
import { UserController } from "../../controllers/users/UserController"
import { classicAuthMiddleware } from "../../middleware/auth"

export const userRoutes = Router()

const userController = new UserController()

userRoutes.get("/", classicAuthMiddleware, userController.getAll)
// userRoutes.post("/", userController.post)
// userRoutes.put("/", userController.put)
// userRoutes.delete("/", userController.delete)
// userRoutes.get("/:id", userController.getOne)
