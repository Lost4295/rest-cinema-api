import {Application} from "express"
import {cinemaSessionRoutes} from "./cinemaSessionRoutes"
import {cinemaRoomRoutes} from "./cinemaRoomRoutes"
import {movieRoutes} from "./movieRoutes"
import {userRoutes} from "./userRoutes"
import {authRoutes} from "./auth"
import {ticketRoutes} from "./ticketRoutes"
import {isOpen} from "../middleware/open"
import {utilsRoutes} from "./utilsRoutes"

export const routesHandler = (app: Application) => {
    app.use('/', utilsRoutes)
    app.use('/auth', authRoutes)
    app.use('/sessions', cinemaSessionRoutes)
    app.use('/rooms', cinemaRoomRoutes)
    app.use('/movies', isOpen, movieRoutes)

    app.use('/users', userRoutes)

    app.use('/tickets', isOpen, ticketRoutes)
    // app.use('/administrators', administratorRoutes)
    // app.use('/employees', employeeRoutes)

    // app.use('/stats', statsRoutes)
}
