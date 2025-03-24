import { Router } from "express"
import { CinemaRoomController } from "../controllers/CinemaRoomController"

export const cinemaRoomRoutes = Router()

const cinemaRoomController = new CinemaRoomController()

cinemaRoomRoutes.get("/", cinemaRoomController.get)
cinemaRoomRoutes.post("/", cinemaRoomController.post)
cinemaRoomRoutes.put("/", cinemaRoomController.put)
cinemaRoomRoutes.delete("/", cinemaRoomController.delete)
cinemaRoomRoutes.get("/:id", cinemaRoomController.getOne)
