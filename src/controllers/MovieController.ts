import {Request, Response} from "express"
import {PrismaClient} from "../db/client"
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../validators/movie"
import {logger} from "../app"
import formatHTTPLoggerResponse from "../loggerformat"

const db = new PrismaClient()

export class MovieController {
    async get(req: Request, res: Response) {
        const movies = await db.movie.findMany()
        res.status(200).send(movies)
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetMovieController request : success'}))

    }

    async post(req: Request, res: Response) {
        const bodyValidator = createMovieValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            //TODO : change with logger.error : console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'PostMovieController request : success'}))
            return
        }
        const body = bodyValidator.value
        await db.movie.create({data: body})
        res.status(201).send({"message": "Ressource created successfully."})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'PostMovieController request : success'}))
    }

    async put(req: Request, res: Response) {
        const idValidator = movieIdValidator.validate(req.params)
        if (idValidator.error !== undefined) {
            //TODO : change with logger.error
            console.error(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'PutMovieController request : success'}))
            return
        }
        const movie = await db.movie.findUnique({
            where: {
                id: idValidator.value.id
            }
        })
        if (!movie) {
            res.status(404).send({"message": "ressource not found"})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'PutMovieController request : success'}))
            return
        }
        const bodyValidator = updateMovieValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            //TODO : change with logger.error console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'PutMovieController request : success'}))
            return
        }
        const body = bodyValidator.value
        await db.movie.update({where: {id: idValidator.value.id}, data: body})
        res.status(200).send({"message": "Ressource modified successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'PutMovieController request : success'}))
    }

    async delete(req: Request, res: Response) {
        const idValidator = movieIdValidator.validate(req.params)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'DeleteMovieController request : success'}))
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
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'DeleteMovieController request : success'}))
            return
        }
        await db.movie.delete({
            where: {
                id: movie.id
            }
        })
        res.status(204).send()
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'DeleteMovieController request : success'}))
    }

    async getOne(req: Request, res: Response) {
        //TODO: add filters on period
        const idValidator = movieIdValidator.validate(req.params)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetOneMovieController request : success'}))
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
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetOneMovieController request : success'}))
            return
        }
        res.status(200).send(movie)
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetOneMovieController request : success'}))
    }
}
