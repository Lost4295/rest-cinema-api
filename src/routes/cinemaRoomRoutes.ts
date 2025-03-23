import { Application } from "express"
import { CinemaRoomController } from "../controllers/CinemaRoomController"

export const cinemaRoomRoutes = (app: Application) => {
  const cinemaRoomController = new CinemaRoomController()
  app.get('/',cinemaRoomController.get)
  app.post('/',cinemaRoomController.post)
  app.put('/',cinemaRoomController.put)
  app.delete('/',cinemaRoomController.delete)
  app.get('/:id',cinemaRoomController.getOne)
}
