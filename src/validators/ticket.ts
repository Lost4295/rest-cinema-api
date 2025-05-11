import Joi from "joi"

export const ticketCreateValidator = Joi.object({
    superTicket: Joi.boolean().required(),
}).options({abortEarly: false})


export const ticketIdValidator = Joi.object({
    id: Joi.number().required().min(1),
}).options({abortEarly: false})

export const ticketUseValidator = Joi.object({
    sessionId: Joi.number().required().min(1),
}).options({abortEarly: false})


export const ticketUpdateValidator = Joi.object({
    sessionId: Joi.number().optional().min(1),
    userId: Joi.number().optional().min(1),
    used: Joi.boolean().optional(),
    remainingUses: Joi.number().optional().min(0),
}).options({abortEarly: false}).or("sessionId", "userId", "used", "remainingUses")
