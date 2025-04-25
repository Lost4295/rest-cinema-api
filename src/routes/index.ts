import {Application} from "express"
import {cinemaSessionRoutes, testCinemaSessionRoutes} from "./cinemaSessionRoutes"
import {cinemaRoomRoutes, testCinemaRoomRoutes} from "./cinemaRoomRoutes"
import {movieRoutes, testMovieRoutes} from "./movieRoutes"
import {testUserRoutes, userRoutes} from "./userRoutes"
import {authRoutes, testAuthRoutes} from "./auth"
import {testTicketRoutes, ticketRoutes} from "./ticketRoutes"
import {testUtilsRoutes, utilsRoutes} from "./utilsRoutes"

export const routesHandler = (app: Application, isTest: boolean) => {
    if (!isTest) {
        app.use('/', utilsRoutes)
        app.use('/auth', authRoutes)
        app.use('/sessions', cinemaSessionRoutes)
        app.use('/rooms', cinemaRoomRoutes)
        app.use('/movies', movieRoutes)
        app.use('/users', userRoutes)
        app.use('/tickets', ticketRoutes)
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
