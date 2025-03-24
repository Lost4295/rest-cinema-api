import { Router } from "express"
import { CinemaSessionController } from "../controllers/CinemaSessionController"

export const cinemaSessionRoutes = Router()

const cinemaSessionController = new CinemaSessionController()

cinemaSessionRoutes.get("/", cinemaSessionController.get)
cinemaSessionRoutes.post("/", cinemaSessionController.post)
cinemaSessionRoutes.put("/", cinemaSessionController.put)
cinemaSessionRoutes.delete("/", cinemaSessionController.delete)
cinemaSessionRoutes.get("/:id/tickets", cinemaSessionController.getOneTiekets)
