import {Request, Response} from "express"
import {PrismaClient} from "../db/client"
import {cinemaRoomIdValidator, createCinemaRoomValidator, updateCinemaRoomValidator} from "../validators/rooms"
import {logger} from "../app"
import formatHTTPLoggerResponse from "../loggerformat"

const db = new PrismaClient()

export class CinemaRoomController {
    async get(_req: Request, res: Response) {
        const rooms = await db.room.findMany({where: {onMaintenance: false}})
        res.status(200).send(rooms)
        logger.info(formatHTTPLoggerResponse(_req, res, {message: 'GetCinemaRoomController request : success'}))
    }

    async post(req: Request, res: Response) {
        const bodyValidator = createCinemaRoomValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            //TODO : change with logger.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'PostCinemaRoomController request fail : validation error'}))
            return
        }
        const body = bodyValidator.value
        await db.room.create({data: body})
        res.status(201).send({"message": "Ressource created successfully."})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'PostCinemaRoomController request : success'}))

    }

    async put(req: Request, res: Response) {
        const bodyValidator = updateCinemaRoomValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            //TODO : change with logger.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'PutCinemaRoomController request fail : validation error'}))

            return
        }
        const body = bodyValidator.value
        const room = await db.room.findUnique({
            where: {
                id: body.id
            }
        })
        if (!room) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'PutCinemaRoomController request fail : ressource not found'}))
        }
        await db.room.update({data: body, where: {id: body.id}})
        res.status(200).send({"message": "Ressource modified successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'PutCinemaRoomController request : success'}))
    }

    async delete(req: Request, res: Response) {
        const idValidator = cinemaRoomIdValidator.validate(req.query)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'DeleteCinemaRoomController request fail : validation error'}))
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
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'DeleteCinemaRoomController request fail : ressource not found'}))
            return
        }
        await db.room.delete({
            where: {
                id: room.id
            }
        })
        res.status(204).send()
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'DeleteCinemaRoomController request : success'}))
    }


    async getOne(req: Request, res: Response) {
        //TODO : add period filters
        const idValidator = cinemaRoomIdValidator.validate(req.query)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetOneCinemaRoomController request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        const room = await db.room.findUnique({
            where: {
                id: value,
                onMaintenance:
                    false
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
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetOneCinemaRoomController request fail : ressource not found'}))
            return
        }
        res.status(200).send(room.sessions)
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetOneCinemaRoomController request : success'}))
    }
}
