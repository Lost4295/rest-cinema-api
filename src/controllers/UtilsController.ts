import {logger} from "../format"
import formatHTTPLoggerResponse from "../loggerformat"
import {Request, Response} from "express"


export class UtilsController {
    baseRoute(req: Request, res: Response) {
        const message = 'Hello World ! The cinema is currently ' +
            ((9 < new Date().getHours() && new Date().getHours() < 20) ? 'open.' : 'closed.')
        res.status(200).send({
            message: message
        })
        logger.info(formatHTTPLoggerResponse(req, res, {message: 'Hello World request'}))
    }
}
