import Joi from "joi"
import {CinemaSessionBody, CinemaSessionBodyWithRelations} from "../types/cinemaSession"

export const createCinemaSessionValidator = Joi.object<CinemaSessionBody>({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    movie: Joi.object({
        id: Joi.number().required()
    }).required(),
    room: Joi.object({
        id: Joi.number().required()
    }).required(),
}).options({abortEarly: false})
export const cinemaSessionIdValidator = Joi.object<CinemaSessionBody>({
    id: Joi.number().required()
}).options({abortEarly: false})
export const updateCinemaSessionValidator = Joi.object<CinemaSessionBodyWithRelations>({
    id: Joi.number().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    tickets: Joi.number().optional(),
}).options({abortEarly: false}).or("startDate", "endDate", "movie")
