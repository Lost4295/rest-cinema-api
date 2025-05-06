import {Router} from "express"
import {CinemaRoomController} from "../controllers/CinemaRoomController"
import {adminAuthMiddleware, employeeAuthMiddleware} from "../middleware/auth";

export const cinemaRoomRoutes = Router()

const cinemaRoomController = new CinemaRoomController()

cinemaRoomRoutes.get("/", cinemaRoomController.get)
cinemaRoomRoutes.post("/", cinemaRoomController.post)
cinemaRoomRoutes.put("/:id", cinemaRoomController.put)
cinemaRoomRoutes.delete("/:id", adminAuthMiddleware, cinemaRoomController.delete)
cinemaRoomRoutes.get("/:id", cinemaRoomController.getOne)
cinemaRoomRoutes.get("/:id/maintenance/on", employeeAuthMiddleware, cinemaRoomController.setMaintenance)
cinemaRoomRoutes.get("/:id/maintenance/off", employeeAuthMiddleware, cinemaRoomController.removeMaintenance)

export const testCinemaRoomRoutes = Router()


testCinemaRoomRoutes.get("/", cinemaRoomController.get)
testCinemaRoomRoutes.post("/", cinemaRoomController.post)
testCinemaRoomRoutes.put("/:id", cinemaRoomController.put)
testCinemaRoomRoutes.delete("/:id", cinemaRoomController.delete)
testCinemaRoomRoutes.get("/:id", cinemaRoomController.getOne)
testCinemaRoomRoutes.get("/:id/maintenance/on", cinemaRoomController.setMaintenance)
testCinemaRoomRoutes.get("/:id/maintenance/off", cinemaRoomController.removeMaintenance)
