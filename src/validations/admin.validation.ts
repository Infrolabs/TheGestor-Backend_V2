import { Joi } from 'express-validation'

export const adminLoginReqSchema = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}