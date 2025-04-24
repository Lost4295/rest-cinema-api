import {Request, Response} from "express"
import {userIdValidator} from "../validators/user"
import formatHTTPLoggerResponse from "../loggerformat"
import {PrismaClient, SuperTicket, Ticket} from "../db/client"
import {ticketCreateValidator, ticketIdValidator, ticketUpdateValidator, ticketUseValidator} from "../validators/ticket"
import {config} from "../config/config"
import {logger} from "../format"


const db = new PrismaClient()
const TICKET_PRICE = config.ticketPrice

export class TicketController {
    async get(req: Request, res: Response) {
        const validator = userIdValidator.validate(req.query)
        if (validator.error) {
            res.status(400).send(validator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.get request fail : bad request '}))
            return
        }
        const value = validator.value.id
        const tickets = await db.ticket.findMany({
            where: {
                user: {
                    id: value
                }
            }
        })
        res.status(200).send({"tickets": tickets})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'TicketController.get request : success'}))
    }

    async buyTicket(req: Request, res: Response) {
        const validator = ticketCreateValidator.validate(req.query)
        if (validator.error) {
            res.status(400).send(validator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.buyTicket request fail : bad request '}))
            return
        }
        const value = validator.value
        const userId = 1
        const notEnoughMoneyToBuyTicket = 0 //TODO : check if the user has enough money to buy the ticket
        //TODO : check if the user is logged in to get infos,  and if he has enough money
        if (notEnoughMoneyToBuyTicket) {
            res.status(400).send({"message": "not enough money"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.buyTicket request fail : not enough money '}))
            return
        }
        if (value.superTicket) {
            await db.transaction.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    price: TICKET_PRICE, //????
                    superTicket: {
                        create: {
                            user: {
                                connect: {
                                    id: userId
                                }
                            },
                        }
                    }
                }
            })
            res.status(200).send({"message": "ticket bought successfully"})
        } else {
            await db.transaction.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    price: TICKET_PRICE, //????
                    ticket: {
                        create: {
                            user: {
                                connect: {
                                    id: userId
                                }
                            },
                            session: {}
                        }
                    }
                }
            })
            res.status(200).send({"message": "ticket bought successfully"})
        }
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'TicketController.buyTicket request : success'}))

    }

    //Todo : accessible que par les admins
    async modifyTicket(req: Request, res: Response) {
        const idValidator = ticketIdValidator.validate(req.query)
        if (idValidator.error !== undefined) {
            res.status(400).send(idValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.modifyTicket request fail: validation error'}))
            return
        }
        const value = idValidator.value.id
        let ticket: MyTicket = await db.ticket.findUnique({
            where: {
                id: value
            }
        })
        if (!ticket) {
            ticket = await db.superTicket.findUnique({
                where: {
                    id: value
                }
            })
        }
        if (!ticket) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.modifyTicket request fail : ressource not found'}))
            return
        }
        const bodyValidator = ticketUpdateValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            res.status(400).send(bodyValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.modifyTicket request fail: validation error'}))
            return
        }
        const body = bodyValidator.value
        if (!ticket.isSuperTicket) {
            await db.ticket.update({where: {id: idValidator.value.id}, data: body})
        } else {
            await db.superTicket.update({where: {id: idValidator.value.id}, data: body})
        }
        res.status(200).send({"message": "Ressource modified successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'TicketController.modifyTicket request : success'}))
    }

    //Todo : accessible que par les admins ou la personne qui a le ticket
    async delete(req: Request, res: Response) {
        const idValidator = ticketIdValidator.validate(req.query)
        if (idValidator.error) {
            console.log(idValidator.error)
            res.status(400).send(idValidator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.delete request fail : validation error'}))
            return
        }
        const value = idValidator.value.id
        let ticket: MyTicket = await db.ticket.findUnique({
            where: {
                id: value
            }
        })
        if (!ticket) {
            ticket = await db.superTicket.findUnique({
                where: {
                    id: value
                }
            })
        }
        if (!ticket) {
            res.status(404).send({"message": "ressource not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.delete request fail : ressource not found'}))
            return
        }
        if (!ticket.isSuperTicket) {
            await db.ticket.delete({
                where: {
                    id: ticket.id
                }
            })
        } else {
            await db.superTicket.delete({
                where: {
                    id: ticket.id
                }
            })
        }
        res.status(204).send()
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'TicketController.delete request : success'}))
    }

    async useTicket(req: Request, res: Response) {
        const validator = ticketIdValidator.validate(req.query)
        if (validator.error) {
            res.status(400).send(validator.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request fail : bad request '}))
            return
        }
        const validator2 = ticketUseValidator.validate(req.body)
        if (validator2.error) {
            res.status(400).send(validator2.error.details)
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request fail : bad request '}))
            return
        }

        const value = validator.value
        const sessionId = validator2.value.sessionId
        let ticket: MyTicket = await db.ticket.findUnique({
            where: {
                id: value.id
            }
        })
        if (!ticket) {
            ticket = await db.superTicket.findUnique({
                where: {
                    id: value.id
                }
            })
        }
        if (!ticket) {
            res.status(400).send({"message": "ticket not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request fail : ticket not found '}))
            return
        }
        const session = await db.session.findUnique({
            where: {
                id: sessionId
            }
        })
        if (!session) {
            res.status(400).send({"message": "session not found"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request fail : session not found '}))
            return
        }
        if (session.startDate < new Date()) {
            res.status(400).send({"message": "session already passed"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request fail : session already passed '}))
            return
        }
        if (!ticket.remainingUses) {
            res.status(400).send({"message": "ticket already used"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request fail : ticket already used '}))
            return
        }
        if (!ticket.isSuperTicket) {
            await db.ticket.update({
                where: {
                    id: value.id
                },
                data: {
                    sessionId: sessionId
                }
            })
        } else {
            await db.superTicket.update({
                where: {
                    id: value.id
                },
                data: {
                    session: {
                        connect: {
                            id: sessionId
                        }
                    },
                    remainingUses: ticket.remainingUses - 1
                }
            })
        }
        res.status(200).send({"message": "ticket used successfully"})
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'TicketController.useTicket request : success'}))
    }
}

type MyTicket = Ticket | SuperTicket | null
