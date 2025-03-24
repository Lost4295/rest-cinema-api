import {Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {createCinemaSessionValidator, updateCinemaSessionValidator} from "../validators/session";
import {CinemaSession} from "../db/models/CinemaSession";
import {Movie} from "../db/models/Movie";

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
            return;
        }
        const body = bodyValidator.value
        const sessionRepository = AppDataSource.getRepository(CinemaSession)
        const session = await sessionRepository.findOneBy({
            id: body.id
        })
        if (!session) {
            res.status(404).send({"message": "ressource not found"})
            return;
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
        res.status(200).send("delete")
    }

    async getOneTickets(req: Request, res: Response) {
        res.status(200).send("get")
    }
}
