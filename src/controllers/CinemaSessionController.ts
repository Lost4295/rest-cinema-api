import {Application, Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {CinemaSession} from "../db/models/CinemaSession"

class CinemaSessionController {
    async get(req:Request, res:Response){
        //TODO : add filters on period
        const sessionRepository = AppDataSource.getRepository(CinemaSession)
        const sessions = await sessionRepository.find()
        res.status(200).send(sessions)
    }
    async post(req:Request, res:Response){
        res.status(200).send("post")
    }
    async put(req:Request, res:Response){
        res.status(200).send("put")
    }
    async delete(req:Request, res:Response){
        res.status(200).send("delete")
    }

    async getOneTiekets(req:Request, res:Response){
        res.status(200).send("get")
    }
}

export const cinemaSessionController = (app: Application) => {
    const cinemaSessionController = new CinemaSessionController()
    app.get('/',cinemaSessionController.get)
    app.post('/',cinemaSessionController.post)
    app.put('/',cinemaSessionController.put)
    app.delete('/',cinemaSessionController.delete)
    app.get('/:id/tickets',cinemaSessionController.getOneTiekets)
}
