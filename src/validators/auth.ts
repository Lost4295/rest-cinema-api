import Joi from "joi"
import { User } from "../db/models/User"

export const authValidator = Joi.object<User>({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(20),
}).options({abortEarly: false})
