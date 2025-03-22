import { Application, Request, Response } from "express"
import {cinemaRoomController} from "../controllers/CinemaRoomController"
import {movieController} from "../controllers/MovieController"
import { cinemaSessionController } from "../controllers/CinemaSessionController"

export const routesHandler = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' })
  })

  app.use('/sessions', cinemaSessionController)
  app.use('/rooms', cinemaRoomController)
  app.use('/movies', movieController)
}
