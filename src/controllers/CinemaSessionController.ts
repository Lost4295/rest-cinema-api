import {Request, Response} from "express"
import {PrismaClient} from "../db/client"
import {
    cinemaSessionIdValidator,
    createCinemaSessionValidator,
    updateCinemaSessionValidator
} from "../validators/session"
import formatHTTPLoggerResponse from "../loggerformat"
import {sessionOptionsValidator} from "../validators/period"
import {logger} from "../format"
import moment from "moment"
import {isChevauchement, isEmpty} from "../utils"
import {CinemaSessionBodyWithRelations, SessionObject} from "../types/cinemaSession"

const db = new PrismaClient()

function merger(session: SessionObject, body: CinemaSessionBodyWithRelations) {

    return {
        endDate: body.endDate ? body.endDate : session.endDate,
        movieId: session.movieId,
        roomId: session.roomId,
        startDate: body.startDate ? body.startDate : session.startDate
    }
}

export class CinemaSessionController {
    async get(req: Request, res: Response) {
        const perValidator = sessionOptionsValidator.validate(req.body)
        if (perValidator.error) {
            res.status(400).send({"message": perValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.get request fail : validation error'}))
            return
        }
        const sessions = await db.session.findMany({
            where: {
                room: {
                    onMaintenance: false
                }
            }
        })
        let session
        if (isEmpty(perValidator.value)) {
            session = sessions.filter((session) => {
                return moment(session.startDate).isAfter(moment())
            })
        } else {
            if (perValidator.value.startDate !== undefined) {
                session = sessions.filter((session) => {
                    return moment(session.startDate).isBetween(moment(perValidator.value.startDate), moment(perValidator.value.endDate))
                        && moment(session.endDate).isBetween(moment(perValidator.value.startDate), moment(perValidator.value.endDate))
                })
            }
            if (perValidator.value.allSessions === true) {
                session = sessions
            }
        }
        res.status(200).send({"sessions": session})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.get request : success'}))
    }

    async post(req: Request, res: Response) {
        const bodyValidator = createCinemaSessionValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send({"message": bodyValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : validation error'}))
            return
        }
        const body = bodyValidator.value

        const room = await db.room.findUnique({where: {id: body.roomId}})
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : ressource not found (room)'}))
            return
        }
        if (room.onMaintenance) {
            res.status(401).send({"message": "Room in on maintenance. Action impossible."})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : room on maintenance'}))
            return
        }
        const movie = await db.movie.findUnique({where: {id: body.movieId}})
        if (!movie) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : ressource not found (movie)'}))
            return
        }
        const sessions = await db.session.findMany()
        if (isChevauchement(sessions, body)) {
            res.status(401).send({"message": "Session overlapping. Action impossible"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : Session overlapping'}))
            return
        }

        await db.session.create({
            data: {
                startDate: body.startDate,
                endDate: body.endDate,
                movie: {
                    connect: {
                        id: body.movieId
                    }
                },
                room: {
                    connect: {
                        id: body.roomId
                    }
                },
            }
        })
        res.status(201).send({"message": "Ressource created successfully."})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request : success'}))

    }

    async put(req: Request, res: Response) {
        const idValidator = cinemaSessionIdValidator.validate(req.params)
        if (idValidator.error !== undefined) {
            res.status(400).send({"message": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.put request fail : validation error'}))
            return
        }
        const bodyValidator = updateCinemaSessionValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send({"message": bodyValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.put request fail : validation error'}))
            return
        }
        const body = bodyValidator.value
        const session = await db.session.findUnique({
            where: {
                id: body.id,
                room: {onMaintenance: false}
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
        const sessions = await db.session.findMany()
        if (isChevauchement(sessions, merger(session, body))) {
            res.status(401).send({"message": "Session overlapping. Action impossible"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.post request fail : Session overlapping'}))
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
            res.status(400).send({"messsage": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.delete request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const session = await db.session.findUnique({
            where: {
                id: value,
                room: {onMaintenance: false}
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
        const idValidator = cinemaSessionIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({"messsage": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOneTickets request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const session = await db.session.findUnique({
            where: {
                id: value,
                room: {onMaintenance: false}
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
        res.status(200).send({
            "remaining_tickets": remainingTickets,
            "people_on_session": session.tickets.length + session.superTickets.length
        })
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOneTickets request : success'}))
    }

    async getOne(req: Request, res: Response) {
        const idValidator = cinemaSessionIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({"messsage": idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOne request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const session = await db.session.findUnique({
            where: {
                id: value,
                room: {onMaintenance: false}
            },
            include: {movie: true}
        })
        if (!session) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOne request fail : ressource not found'}))
            return
        }
        res.status(200).send(session)
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaSessionController.getOne request : success'}))
    }
}
