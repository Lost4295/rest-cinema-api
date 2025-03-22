import Joi from "joi"
import {CinemaSessionBody} from "../db/models/CinemaSession"

export const createCinemaSessionValidator = Joi.object<CinemaSessionBody>({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    movie: Joi.number().required()
})
