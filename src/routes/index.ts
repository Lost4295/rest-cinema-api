import { Application, Request, Response } from "express"
import { cinemaSessionRoutes } from "./cinemaSessionRoutes"
import { cinemaRoomRoutes } from "./cinemaRoomRoutes"
import { movieRoutes } from "./movieRoutes"
import { userRoutes } from "./user/userRoutes"
import { authRoutes } from "./auth"

export const routesHandler = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' })
  })

  app.use('/auth', authRoutes)

  app.use('/sessions', cinemaSessionRoutes)
  app.use('/rooms', cinemaRoomRoutes)
  app.use('/movies', movieRoutes)

  app.use('/users', userRoutes)
  // app.use('/administrators', administratorRoutes)
  // app.use('/employees', employeeRoutes)

  // app.use('/tickets', ticketRoutes)
  // app.use('/stats', statsRoutes)
}
