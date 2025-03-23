import {Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {CinemaSession} from "../db/models/CinemaSession"

export class CinemaSessionController {
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
