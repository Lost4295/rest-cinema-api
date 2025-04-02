import Joi from "joi"
import {CinemaSessionBody} from "../db/models/CinemaSession"

export const createCinemaSessionValidator = Joi.object<CinemaSessionBody>({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    movie: Joi.object({
        id: Joi.number().required()
    }).required()
}).options({abortEarly: false})
export const cinemaSessionIdValidator = Joi.object<CinemaSessionBody>({
    id: Joi.number().required()
}).options({abortEarly: false})
export const updateCinemaSessionValidator = Joi.object<CinemaSessionBody>({
    id: Joi.number().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    movie: Joi.object({
        id: Joi.number().required()
    }).optional()
}).options({abortEarly: false}).or("startDate", "endDate", "movie")
