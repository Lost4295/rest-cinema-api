import {Router} from "express"
import {CinemaSessionController} from "../controllers/CinemaSessionController"
import {employeeAuthMiddleware} from "../middleware/auth"

export const cinemaSessionRoutes = Router()

const cinemaSessionController = new CinemaSessionController()

cinemaSessionRoutes.get("/", cinemaSessionController.get)
cinemaSessionRoutes.post("/", employeeAuthMiddleware, cinemaSessionController.post)
cinemaSessionRoutes.get("/:id", cinemaSessionController.getOne)
cinemaSessionRoutes.put("/:id", employeeAuthMiddleware, cinemaSessionController.put)
cinemaSessionRoutes.delete("/:id", employeeAuthMiddleware, cinemaSessionController.delete)
cinemaSessionRoutes.get("/:id/tickets", cinemaSessionController.getOneTickets)

export const testCinemaSessionRoutes = Router()

testCinemaSessionRoutes.get("/", cinemaSessionController.get)
testCinemaSessionRoutes.post("/", cinemaSessionController.post)
testCinemaSessionRoutes.get("/:id", cinemaSessionController.getOne)
testCinemaSessionRoutes.put("/:id", cinemaSessionController.put)
testCinemaSessionRoutes.delete("/:id", cinemaSessionController.delete)
testCinemaSessionRoutes.get("/:id/tickets", cinemaSessionController.getOneTickets)
