import {Router} from "express"
import {MovieController} from "../controllers/MovieController"

export const movieRoutes = Router()

const movieController = new MovieController()

movieRoutes.get("/", movieController.get)
movieRoutes.post("/", movieController.post)
movieRoutes.put("/:id", movieController.put)
movieRoutes.delete("/:id", movieController.delete)
movieRoutes.get("/:id", movieController.getOne)

export const testMovieRoutes = Router()

testMovieRoutes.get("/", movieController.get)
testMovieRoutes.post("/", movieController.post)
testMovieRoutes.put("/:id", movieController.put)
testMovieRoutes.delete("/:id", movieController.delete)
testMovieRoutes.get("/:id", movieController.getOne)

