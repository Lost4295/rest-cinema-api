import {Router} from "express"
import {CinemaRoomController} from "../controllers/CinemaRoomController"
import {isOpen} from "../middleware/open"

export const cinemaRoomRoutes = Router()

const cinemaRoomController = new CinemaRoomController()

cinemaRoomRoutes.get("/", cinemaRoomController.get)
cinemaRoomRoutes.post("/", cinemaRoomController.post)
cinemaRoomRoutes.put("/:id", cinemaRoomController.put)
cinemaRoomRoutes.delete("/:id", cinemaRoomController.delete)
cinemaRoomRoutes.get("/:id", isOpen, cinemaRoomController.getOne)
