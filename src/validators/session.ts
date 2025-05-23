import Joi from "joi"
import {CinemaSessionBody, CinemaSessionBodyWithRelations} from "../types/cinemaSession"

export const createCinemaSessionValidator = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    movieId: Joi.number().required(),
    roomId: Joi.number().required(),
}).options({abortEarly: false})
export const cinemaSessionIdValidator = Joi.object<CinemaSessionBody>({
    id: Joi.number().required()
}).options({abortEarly: false})
export const updateCinemaSessionValidator = Joi.object<CinemaSessionBodyWithRelations>({
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    movie: Joi.number().optional(),
    room: Joi.number().optional()
}).options({abortEarly: false}).or("startDate", "endDate", "movie", "room")
