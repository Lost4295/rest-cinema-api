import Joi from "joi"

export const periodValidator = Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().when('startDate', {is: Joi.exist(), then: Joi.required()}),
}).options({abortEarly: false}).custom((value, helpers) => {
    if (value.startDate > value.endDate) {
        return helpers.error("any.invalid")
    }
    return value
})

export const sessionOptionsValidator = Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().when('startDate', {is: Joi.exist(), then: Joi.required()}),
    allSessions: Joi.boolean().optional()
}).options({abortEarly: false}).custom((value, helpers) => {
    if (value.startDate > value.endDate) {
        return helpers.error("any.invalid")
    }
    return value
}).or('startDate', 'allSessions')
