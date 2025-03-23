import { Application } from "express"
import { CinemaSessionController } from "../controllers/CinemaSessionController"

export const cinemaSessionRoutes = (app: Application) => {
    const cinemaSessionController = new CinemaSessionController()
    app.get('/',cinemaSessionController.get)
    app.post('/',cinemaSessionController.post)
    app.put('/',cinemaSessionController.put)
    app.delete('/',cinemaSessionController.delete)
    app.get('/:id/tickets',cinemaSessionController.getOneTiekets)
}
