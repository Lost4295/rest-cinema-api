import {Application} from "express"
import {cinemaSessionRoutes, testCinemaSessionRoutes} from "./cinemaSessionRoutes"
import {cinemaRoomRoutes, testCinemaRoomRoutes} from "./cinemaRoomRoutes"
import {movieRoutes, testMovieRoutes} from "./movieRoutes"
import {testUserRoutes, userRoutes} from "./userRoutes"
import {authRoutes, testAuthRoutes} from "./auth"
import {testTicketRoutes, ticketRoutes} from "./ticketRoutes"
import {testUtilsRoutes, utilsRoutes} from "./utilsRoutes"
import {classicAuthMiddleware} from "../middleware/auth"

export const routesHandler = (app: Application, isTest: boolean) => {
    if (!isTest) {
        app.use('/', utilsRoutes)
        app.use('/auth', authRoutes)
        app.use('/sessions', classicAuthMiddleware, cinemaSessionRoutes)
        app.use('/rooms', classicAuthMiddleware, cinemaRoomRoutes)
        app.use('/movies', classicAuthMiddleware, movieRoutes)
        app.use('/users', classicAuthMiddleware, userRoutes)
        app.use('/tickets', classicAuthMiddleware, ticketRoutes)
    } else {
        app.use('/', testUtilsRoutes)
        app.use('/auth', testAuthRoutes)
        app.use('/sessions', testCinemaSessionRoutes)
        app.use('/rooms', testCinemaRoomRoutes)
        app.use('/movies', testMovieRoutes)
        app.use('/users', testUserRoutes)
        app.use('/tickets', testTicketRoutes)
    }
    // app.use('/administrators', administratorRoutes)
    // app.use('/employees', employeeRoutes)

    // app.use('/stats', statsRoutes)
}
