import {Router} from "express"
import {UserController} from "../controllers/UserController"
import {adminAuthMiddleware} from "../middleware/auth"

export const userRoutes = Router()

const userController = new UserController()

userRoutes.get("/", adminAuthMiddleware, userController.getAll)
userRoutes.get("/profile", userController.getProfile)
userRoutes.put("/password", userController.updatePassword)
userRoutes.post("/", adminAuthMiddleware, userController.createUserWithRole)
userRoutes.delete("/:id", adminAuthMiddleware, userController.deleteUser)
userRoutes.get("/credit", userController.creditMoney)
userRoutes.get("/debite", userController.debiteMoney)
userRoutes.get("/mytransaction", userController.getMyTransaction)
userRoutes.get("/transactions",adminAuthMiddleware,userController.getAllTransaction)
userRoutes.get("/all-user-used-api", adminAuthMiddleware, userController.getAllUserUsedAPi)
userRoutes.get("/:id/user-activity", adminAuthMiddleware, userController.getUserDetailsAndActivity)

export const testUserRoutes = Router()
testUserRoutes.get("/", userController.getAll)
testUserRoutes.get("/profile", userController.getProfile)
testUserRoutes.put("/password", userController.updatePassword)
testUserRoutes.post("/", userController.createUserWithRole)
testUserRoutes.delete("/:id", userController.deleteUser)

testUserRoutes.get("/credit", userController.creditMoney)
testUserRoutes.get("/debite", userController.debiteMoney)
testUserRoutes.get("/mytransaction",userController.getMyTransaction)
testUserRoutes.get("/transactions",userController.getAllTransaction)
testUserRoutes.get("/all-user-used-api", userController.getAllUserUsedAPi)
testUserRoutes.get("/user-activity", userController.getUserDetailsAndActivity)
