import { EPremiumType } from '@/interfaces/premium.interface'
import { Joi } from 'express-validation'

export const adminLoginReqSchema = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}

export const adminUsersReqSchema = {
    query: Joi.object({
        search: Joi.string().optional().allow(""),
        premiumType: Joi.string().valid(...Object.values(EPremiumType)).optional().allow(""),
        skip: Joi.number().optional().allow(""),
        limit: Joi.number().optional().allow("")
    })
}