import Joi from "joi"
import {CinemaRoomBody} from "../db/models/CinemaRoom"

export const createCinemaRoomValidator = Joi.object<CinemaRoomBody>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().required(),
    type: Joi.string().required(),
    capacity: Joi.number().required().min(15).max(30),
    disabledAccess: Joi.boolean().required(),
}).options({abortEarly:false})
