import Joi from "joi"

export const periodValidator = Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().when('startDate', {is: Joi.exist(), then: Joi.required(), otherwise: Joi.forbidden()}),
}).options({abortEarly: false}).custom((value, helpers) => {
    if (value.startDate > value.endDate) {
        return helpers.message({"custom": "The startDate cannot be after the endDate."})
    }
    return value
})

export const sessionOptionsValidator = Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().when('startDate', {is: Joi.exist(), then: Joi.required()}),
    allSessions: Joi.boolean().when('startDate', {is: Joi.exist(), then: Joi.forbidden(), otherwise: Joi.optional()})
}).options({abortEarly: false}).custom((value, helpers) => {
    if (value.startDate > value.endDate) {
        return helpers.message({"custom": "The startDate cannot be after the endDate."})
    }
    return value
})
//.or('startDate', 'allSessions')

