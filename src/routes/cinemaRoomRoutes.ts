import {Router} from "express"
import {CinemaRoomController} from "../controllers/CinemaRoomController"

export const cinemaRoomRoutes = Router()

const cinemaRoomController = new CinemaRoomController()

cinemaRoomRoutes.get("/", cinemaRoomController.get)
cinemaRoomRoutes.post("/", cinemaRoomController.post)
cinemaRoomRoutes.put("/:id", cinemaRoomController.put)
cinemaRoomRoutes.delete("/:id", cinemaRoomController.delete)
cinemaRoomRoutes.get("/:id", cinemaRoomController.getOne)
cinemaRoomRoutes.get("/:id/maintenance/on", cinemaRoomController.setMaintenance)
cinemaRoomRoutes.get("/:id/maintenance/off", cinemaRoomController.removeMaintenance)
