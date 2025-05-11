import {Request, Response} from "express"
import {PrismaClient} from "../db/client"
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../validators/movie"
import formatHTTPLoggerResponse from "../loggerformat"
import {sessionOptionsValidator} from "../validators/period"
import {logger} from "../format"
import moment from "moment/moment";

const db = new PrismaClient()

export class MovieController {
    async get(req: Request, res: Response) {
        const movies = await db.movie.findMany()
        res.status(200).send(movies)
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'MovieController.get request : success'}))

    }

    async post(req: Request, res: Response) {
        const bodyValidator = createMovieValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send({"message": bodyValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.post request : validation error'}))
            return
        }
        const body = bodyValidator.value
        await db.movie.create({data: body})
        res.status(201).send({"message": "Ressource created successfully."})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'MovieController.post request : success'}))
    }

    async put(req: Request, res: Response) {
        const idValidator = movieIdValidator.validate(req.params)
        if (idValidator.error !== undefined) {
            res.status(400).send({"message": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.put request fail: validation error'}))
            return
        }
        const movie = await db.movie.findUnique({
            where: {
                id: idValidator.value.id
            }
        })
        if (!movie) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.put request fail: ressource not found'}))
            return
        }
        const bodyValidator = updateMovieValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send({"message": bodyValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.put request fail: validation error'}))
            return
        }
        const body = bodyValidator.value
        await db.movie.update({where: {id: idValidator.value.id}, data: body})
        res.status(200).send({"message": "Ressource modified successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'MovieController.put request : success'}))
    }

    async delete(req: Request, res: Response) {
        const idValidator = movieIdValidator.validate(req.params)
        if (idValidator.error) {

            res.status(400).send({"message": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.delete request fail: validation error'}))
            return
        }
        const value = idValidator.value.id
        const movie = await db.movie.findUnique({
            where: {
                id: value
            }
        })
        if (!movie) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.delete request fail: ressource not found'}))
            return
        }
        await db.movie.delete({
            where: {
                id: movie.id
            }
        })
        res.status(204).send()
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'MovieController.delete request : success'}))
    }

    async getOne(req: Request, res: Response) {
        const perValidator = sessionOptionsValidator.validate(req.body)
        if (perValidator.error) {
            res.status(400).send({"message": perValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.getOne request fail : validation error'}))
            return
        }
        const idValidator = movieIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({"message": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.getOne request fail: validation error'}))
            return
        }
        const value = idValidator.value.id
        const movie = await db.movie.findUnique({
            where: {
                id: value
            }, include: {
                sessions: true
            }
        })
        if (!movie) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'MovieController.getOne request fail: ressource not found'}))
            return
        }
        let session
        if (perValidator.value !== undefined) {
            if (perValidator.value.startDate !== undefined) {
                session = movie.sessions.filter((session) => {
                    return moment(session.startDate).isBetween(moment(perValidator.value.startDate), moment(perValidator.value.endDate))
                        && moment(session.endDate).isBetween(moment(perValidator.value.startDate), moment(perValidator.value.endDate))
                })
            }
            if (perValidator.value.allSessions === true) {
                session = movie.sessions
            }
        } else {
            session = movie.sessions.filter((session) => {
                return moment(session.startDate).isAfter(moment())
            })
        }
        res.status(200).send({...movie, sessions: session})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'MovieController.getOne request : success'}))
    }
}
