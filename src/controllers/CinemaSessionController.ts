import {Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {
    cinemaSessionIdValidator,
    createCinemaSessionValidator,
    updateCinemaSessionValidator
} from "../validators/session"
import {CinemaSession} from "../db/models/CinemaSession"
import {Movie} from "../db/models/Movie"

export class CinemaSessionController {
    async get(req: Request, res: Response) {
        //TODO : add filters on period
        const sessionRepository = AppDataSource.getRepository(CinemaSession)
        const sessions = await sessionRepository.find()
        res.status(200).send(sessions)
    }

    async post(req: Request, res: Response) {
        const bodyValidator = createCinemaSessionValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
        }
        const body = bodyValidator.value
        const sessionRepository = AppDataSource.getRepository(CinemaSession)
        await sessionRepository.save(body)
        res.status(201).send({"message": "Ressource created successfully."})
    }

    async put(req: Request, res: Response) {
        const bodyValidator = updateCinemaSessionValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            return
        }
        const body = bodyValidator.value
        const sessionRepository = AppDataSource.getRepository(CinemaSession)
        const session = await sessionRepository.findOneBy({
            id: body.id
        })
        if (!session) {
            res.status(404).send({"message": "ressource not found"})
            return
        }
        if (body.movie) {
            const movieRepository = AppDataSource.getRepository(Movie)
            const movie = await movieRepository.findOneBy({
                id: body.movie.id
            })
            if (!movie) {
                res.status(400).send({"message": "ressource not found"})
                return
            }
        }
        await sessionRepository.preload(body)
        await sessionRepository.save(body)
        res.status(200).send({"message": "Ressource modified successfully"})
    }

    async delete(req: Request, res: Response) {
        const idValidator = cinemaSessionIdValidator.validate(req.query)
        if (idValidator.error){
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            return
        }
        const value = idValidator.value.id
        const repo = AppDataSource.getRepository(CinemaSession)
        const session = await repo.findOneBy({
            id:value
        })
        if (!session){
            res.status(404).send({"message":"ressource not found"})
            return
        }
        await repo.delete(session)
        res.status(204).send()
    }

    async getOneTickets(req: Request, res: Response) {
        const idValidator = cinemaSessionIdValidator.validate(req.query)
        if (idValidator.error){
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            return
        }
        const value = idValidator.value.id
        const repo = AppDataSource.getRepository(CinemaSession)
        const session = await repo.findOneBy({
            id:value
        })
        if (!session){
            res.status(404).send({"message":"ressource not found"})
            return
        }
        const remainingTickets = session.room.capacity - session.tickets
        res.status(200).send({...session, "remaining_tickets":remainingTickets})
    }
}
