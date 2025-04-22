import {Application, Request, Response} from "express"
import {cinemaSessionRoutes} from "./cinemaSessionRoutes"
import {cinemaRoomRoutes} from "./cinemaRoomRoutes"
import {movieRoutes} from "./movieRoutes"
import {userRoutes} from "./userRoutes"
import {authRoutes} from "./auth"
import {logger} from "../app"
import formatHTTPLoggerResponse from "../loggerformat"
import {ticketRoutes} from "./ticketRoutes"
import {isOpen} from "../middleware/open"


export const routesHandler = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        res.status(200).send({message: 'Hello World'})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'Hello World request'}))
    })
    app.use('/auth', authRoutes)
    app.use('/sessions', cinemaSessionRoutes)
    app.use('/rooms', isOpen, cinemaRoomRoutes)
    app.use('/movies', isOpen, movieRoutes)

    app.use('/users', userRoutes)

    // app.use('/administrators', administratorRoutes)
    // app.use('/employees', employeeRoutes)

    app.use('/tickets', isOpen, ticketRoutes)
    // app.use('/stats', statsRoutes)
}
