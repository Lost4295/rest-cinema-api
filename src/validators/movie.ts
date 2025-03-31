import Joi from "joi"
import {MovieBody} from "../db/models/Movie"

export const createMovieValidator = Joi.object<MovieBody>({
    name: Joi.string().required(),
    duration: Joi.number().required(),
}).options({abortEarly:false})

export const movieIdValidator = Joi.object<MovieBody>({
    id:Joi.number().required()
}).options({abortEarly:false})
export const updateMovieValidator = Joi.object<MovieBody>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    duration: Joi.number().optional(),
}).options({abortEarly:false}).or('name', 'duration')