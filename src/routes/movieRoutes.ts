import { Application } from "express"
import { MovieController } from "../controllers/MovieController"

export const movieRoutes = (app: Application) => {
  const movieController = new MovieController()
  app.get('/',movieController.get)
  app.post('/',movieController.post)
  app.put('/',movieController.put)
  app.delete('/',movieController.delete)
  app.get('/:id',movieController.getOne)
}
