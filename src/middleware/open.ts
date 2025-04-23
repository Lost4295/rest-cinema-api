import {NextFunction, Request, Response} from "express"
import formatHTTPLoggerResponse from "../loggerformat"
import {PrismaClient} from "../db/client"
import {userRoles} from "../types/currentUser"
import {logger} from "../format"

export const isOpen = async (req: Request, res: Response, next: NextFunction) => {
    const time = new Date().getHours()
    if (9 < time && time < 20) {
        next()
    } else {
        res.status(403).json({message: "Forbidden : cinema is closed"})
        logger.error(formatHTTPLoggerResponse(req, res, {message: "Forbidden : cinema is closed"}))
        return
    }
}


export const canOpen = async (req: Request, res: Response, next: NextFunction) => {
    const db = new PrismaClient()
    try {
        const confiserie = await db.user.findFirst({
            where: {
                roles: userRoles.CONFISERY
            }
        })
        const accueil = await db.user.findFirst({
            where: {
                roles: userRoles.ACCUEIL
            }
        })
        const projectionniste = await db.user.findFirst({
            where: {
                roles: userRoles.PROJECTIONIST
            }
        })
        if (!confiserie || !accueil || !projectionniste) {
            res.status(403).json({message: "Forbidden : cinema is closed"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: "Forbidden : cinema is closed"}))
            return
        }
        next()
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
            logger.error(formatHTTPLoggerResponse(req, res, {message: error.message}))
        } else {
            res.status(500).json({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: "Internal Server Error"}))
        }
    }
}
