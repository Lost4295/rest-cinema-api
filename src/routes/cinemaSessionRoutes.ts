import {Router} from "express"
import {CinemaSessionController} from "../controllers/CinemaSessionController"
import {isOpen} from "../middleware/open"

export const cinemaSessionRoutes = Router()

const cinemaSessionController = new CinemaSessionController()

cinemaSessionRoutes.get("/", cinemaSessionController.get)
cinemaSessionRoutes.post("/", cinemaSessionController.post)
cinemaSessionRoutes.put("/:id", cinemaSessionController.put)
cinemaSessionRoutes.delete("/:id", cinemaSessionController.delete)
cinemaSessionRoutes.get("/:id/tickets", isOpen, cinemaSessionController.getOneTickets)
