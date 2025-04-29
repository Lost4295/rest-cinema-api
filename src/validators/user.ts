import Joi from "joi"
import {User} from "../db/client"
import {userRoles} from "../types/currentUser"

export const createUserWithRoleValidator = Joi.object<User>({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(20),
    roles: Joi.string().valid(userRoles.CLASSIC, userRoles.CONFISERY, userRoles.ACCUEIL, userRoles.PROJECTIONIST, userRoles.ADMIN, userRoles.SUPER_ADMIN).required()
}).options({abortEarly: false})

export const userIdValidator = Joi.object({
    id: Joi.number().required()
}).options({abortEarly: false})

export const updatePasswordValidator = Joi.object({
    oldPassword: Joi.string().required().min(6).max(20),
    newPassword: Joi.string().required().min(6).max(20)
}).options({abortEarly: false})

export const creditMoneyValidator = Joi.object({
    credit: Joi.string().required().min(1),
}).options({abortEarly: false})

export const debiteMoneyValidator = Joi.object({
    debite: Joi.string().required().min(1),
}).options({abortEarly: false})
