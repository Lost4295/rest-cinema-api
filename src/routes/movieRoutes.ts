import { Router } from "express"
import { MovieController } from "../controllers/MovieController"

export const movieRoutes = Router()

const movieController = new MovieController()

movieRoutes.get("/", movieController.get)
movieRoutes.post("/", movieController.post)
movieRoutes.put("/", movieController.put)
movieRoutes.delete("/", movieController.delete)
movieRoutes.get("/:id", movieController.getOne)
