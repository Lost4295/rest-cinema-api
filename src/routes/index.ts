import { Application, Request, Response } from "express"
import { cinemaSessionRoutes } from "./cinemaSessionRoutes"
import { cinemaRoomRoutes } from "./cinemaRoomRoutes"
import { movieRoutes } from "./movieRoutes"
import { userRoutes } from "./user/userRoutes"
import { authRoutes } from "./auth"
import {logger} from "../app"
import formatHTTPLoggerResponse from "../loggerformat"


export const routesHandler = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        const rand = Number((Math.random() * 10 % 2).toFixed())
        if (rand == 0) {
            res.status(200).send({message: 'Hello World'})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'Hello World request'}))
        } else if (rand == 1) {
            res.status(400).send({message: 'Client Error !'})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'Hello World request fail'}))
        } else {
            res.status(500).send({message: 'Server error'})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'Hello World request fail'}))
        }

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
