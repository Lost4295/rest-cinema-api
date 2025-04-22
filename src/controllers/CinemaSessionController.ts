import {Request, Response} from "express"
import {PrismaClient} from "../db/client"
import {
    cinemaSessionIdValidator,
    createCinemaSessionValidator,
    updateCinemaSessionValidator
} from "../validators/session"
import {logger} from "../app"
import formatHTTPLoggerResponse from "../loggerformat"
import {periodValidator} from "../validators/period"

const db = new PrismaClient()

export class CinemaSessionController {
    async get(req: Request, res: Response) {
        const perValidator = periodValidator.validate(req.body)
        if (perValidator.error) {
            res.status(400).send(perValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.get request fail : validation error'}))
            return
        }
        const sessions = await db.session.findMany()
        res.status(200).send(sessions)
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.get request : success'}))
    }

    async post(req: Request, res: Response) {
        const bodyValidator = createCinemaSessionValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            //TODO : change with logger.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : validation error'}))
        }
        const body = bodyValidator.value
        await db.session.create({data: body})
        res.status(201).send({"message": "Ressource created successfully."})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request : success'}))

    }

    async put(req: Request, res: Response) {
        const bodyValidator = updateCinemaSessionValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            //TODO : change with logger.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.put request fail : validation error'}))
            return
        }
        const body = bodyValidator.value
        const session = await db.session.findUnique({
            where: {
                id: body.id
            },
            include: {
                room: true,
            }
        })
        if (!session) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.put request fail : ressource not found'}))
            return
        }
        await db.session.update({data: body, where: {id: body.id}})
        res.status(200).send({"message": "Ressource modified successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.put request : success'}))
    }


    async delete(req: Request, res: Response) {
        const idValidator = cinemaSessionIdValidator.validate(req.query)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.delete request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const session = await db.session.findUnique({
            where: {
                id: value
            }
        })
        if (!session) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.delete request fail : ressource not found'}))
            return
        }
        await db.session.delete({
            where: {
                id: session.id
            }
        })
        res.status(204).send()
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.delete request : success'}))
    }

    async getOneTickets(req: Request, res: Response) {
        const idValidator = cinemaSessionIdValidator.validate(req.query)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOneTickets request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const session = await db.session.findUnique({
            where: {
                id: value
            }, include: {
                room: true,
                tickets: true,
                superTickets: true
            }
        })
        if (!session) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOneTickets request fail : ressource not found'}))
            return
        }
        const remainingTickets = session.room.seats - session.tickets.length - session.superTickets.length
        res.status(200).send({...session, "remaining_tickets": remainingTickets})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOneTickets request : success'}))
    }

    //Todo : get to séance as utilisateur
}
