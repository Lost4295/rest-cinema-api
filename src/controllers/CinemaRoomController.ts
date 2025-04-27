import {Request, Response} from "express"
import {PrismaClient} from "../db/client"
import {cinemaRoomIdValidator, createCinemaRoomValidator, updateCinemaRoomValidator} from "../validators/rooms"
import formatHTTPLoggerResponse from "../loggerformat"
import {sessionOptionsValidator} from "../validators/period"
import {logger} from "../format"
import moment from "moment"

const db = new PrismaClient()

export class CinemaRoomController {
    async get(_req: Request, res: Response) {
        const rooms = await db.room.findMany({where: {onMaintenance: false}})
        res.status(200).send(rooms)
        logger.info(formatHTTPLoggerResponse(_req, res, {message: 'CinemaRoomController.get request : success'}))
    }

    async post(req: Request, res: Response) {
        const bodyValidator = createCinemaRoomValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send({"message": bodyValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.post request fail : validation error'}))
            return
        }
        const body = bodyValidator.value
        await db.room.create({data: body})
        res.status(201).send({"message": "Ressource created successfully."})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.post request : success'}))

    }

    async put(req: Request, res: Response) {
        const bodyValidator = updateCinemaRoomValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send({"message": bodyValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.put request fail : validation error'}))
            return
        }
        const idValidator = cinemaRoomIdValidator.validate(req.params)
        if (idValidator.error !== undefined) {
            res.status(400).send({message: idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.delete request fail : validation error'}))
            return
        }
        const body = bodyValidator.value
        const id = idValidator.value.id
        const room = await db.room.findUnique({
            where: {
                id: id
            }
        })
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.put request fail : ressource not found'}))
            return
        }
        await db.room.update({data: body, where: {id: room.id}})
        res.status(200).send({"message": "Ressource modified successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.put request : success'}))
    }

    async delete(req: Request, res: Response) {
        const idValidator = cinemaRoomIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({message: idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.delete request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const room = await db.room.findUnique({
            where: {
                id: value
            }
        })
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.delete request fail : ressource not found'}))
            return
        }
        await db.room.delete({
            where: {
                id: room.id
            }
        })
        res.status(204).send()
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.delete request : success'}))
    }


    async getOne(req: Request, res: Response) {
        const perValidator = sessionOptionsValidator.validate(req.body)
        if (perValidator.error) {
            res.status(400).send(perValidator.error.message)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.getOne request fail : validation error'}))
            return
        }

        const idValidator = cinemaRoomIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({message: idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.getOne request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const room = await db.room.findUnique({
            where: {
                id: value,
                onMaintenance: false,
            }, include: {
                sessions: {
                    include: {
                        movie: true
                    }
                }
            }
        })
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.getOne request fail : ressource not found'}))
            return
        }
        let sessions
        if (isEmpty(perValidator.value)) {
            sessions = room.sessions.filter((session) => {
                return moment(session.startDate).isAfter(moment())
            })
        } else {
            if (perValidator.value.startDate !== undefined) {
                sessions = room.sessions.filter((session) => {
                    return moment(session.startDate).isBetween(moment(perValidator.value.startDate), moment(perValidator.value.endDate))
                        && moment(session.endDate).isBetween(moment(perValidator.value.startDate), moment(perValidator.value.endDate))
                })
            }
            if (perValidator.value.allSessions === true) {
                sessions = room.sessions
            }
        }
        res.status(200).send({"sessions": sessions ?? []})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.getOne request : success'}))
    }

    async setMaintenance(req: Request, res: Response) {
        const idValidator = cinemaRoomIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({message: idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.setMaintenance request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const room = await db.room.findUnique({
            where: {
                id: value
            }
        })
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.setMaintenance request fail : ressource not found'}))
            return
        }
        await db.room.update({
            data: {
                onMaintenance: true
            },
            where: {
                id: room.id
            }
        })
        res.status(200).send({"message": "room on maintenance"})
        logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.setMaintenance request success'}))
    }

    async removeMaintenance(req: Request, res: Response) {
        const idValidator = cinemaRoomIdValidator.validate(req.params)
        if (idValidator.error) {
            res.status(400).send({message: idValidator.error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.removeMaintenance request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const room = await db.room.findUnique({
            where: {
                id: value
            }
        })
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.removeMaintenance request fail : ressource not found'}))
            return
        }
        await db.room.update({
            data: {
                onMaintenance: false
            },
            where: {
                id: room.id
            }
        })
        res.status(200).send({"message": "room no longer on maintenance"})
        logger.error(formatHTTPLoggerResponse(req, res, {message: 'CinemaRoomController.removeMaintenance request success'}))
    }
}

function isEmpty(obj: {}) {
    return Object.keys(obj).length === 0
}
