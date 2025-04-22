import Joi from "joi"

export const ticketCreateValidator = Joi.object({
    superTicket: Joi.boolean().required(),
}).options({abortEarly: false})


export const ticketIdValidator = Joi.object({
    id: Joi.number().required(),
}).options({abortEarly: false})

export const ticketUseValidator = Joi.object({
    sessionId: Joi.number().required(),
}).options({abortEarly: false})


export const ticketUpdateValidator = Joi.object({
    sessionId: Joi.number().optional(),
    userId: Joi.number().optional(),
    used: Joi.boolean().optional(),
    remainingUses: Joi.number().optional(),
}).options({abortEarly: false}).or("sessionId", "userId", "used", "remainingUses")
