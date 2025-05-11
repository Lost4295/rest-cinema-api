import {Router} from "express"
import {MovieController} from "../controllers/MovieController"
import {employeeAuthMiddleware} from "../middleware/auth"

export const movieRoutes = Router()

const movieController = new MovieController()

movieRoutes.get("/", movieController.get)
movieRoutes.post("/", employeeAuthMiddleware, movieController.post)
movieRoutes.put("/:id", employeeAuthMiddleware, movieController.put)
movieRoutes.delete("/:id", employeeAuthMiddleware, movieController.delete)
movieRoutes.get("/:id", movieController.getOne)

export const testMovieRoutes = Router()

testMovieRoutes.get("/", movieController.get)
testMovieRoutes.post("/", movieController.post)
testMovieRoutes.put("/:id", movieController.put)
testMovieRoutes.delete("/:id", movieController.delete)
testMovieRoutes.get("/:id", movieController.getOne)

