import Joi from "joi"
import { User, userRoles } from "../db/models/User"

export const createUserWithRoleValidator = Joi.object<User>({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(20),
    role: Joi.string().valid(userRoles).required()
}).options({abortEarly: false})

export const userIdValidator = Joi.object({
    id: Joi.number().required()
}).options({abortEarly: false})

export const updatePasswordValidator = Joi.object({
    oldPassword: Joi.string().required().min(6).max(20),
    newPassword: Joi.string().required().min(6).max(20)
}).options({abortEarly: false})
