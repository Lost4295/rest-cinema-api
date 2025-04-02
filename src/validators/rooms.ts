import Joi from "joi"
import { CinemaRoomBody} from "../db/models/CinemaRoom"

export const createCinemaRoomValidator = Joi.object<CinemaRoomBody>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required(),
    type: Joi.string().required(),
    capacity: Joi.number().required().min(15).max(30),
    disabledAccess: Joi.boolean().required(),
}).options({abortEarly:false})

export const cinemaRoomIdValidator = Joi.object<CinemaRoomBody>({
    id:Joi.number().required()
}).options({abortEarly:false})
export const updateCinemaRoomValidator = Joi.object<CinemaRoomBody>({
    id:Joi.number().required(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    type: Joi.string().optional(),
    capacity: Joi.number().optional().min(15).max(30),
    disabledAccess: Joi.boolean().optional(),
}).options({abortEarly:false}).or("name", "description", "images", "type", "capacity", "disabledAccess")
