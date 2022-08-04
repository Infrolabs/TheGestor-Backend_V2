import { EUserType } from '@/interfaces/users.interface'
import { Joi } from 'express-validation'

export const signupReqSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        countryCode: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        otp: Joi.string().required(),
        userType: Joi.string().valid(...Object.values(EUserType)).required(),
        password: Joi.string().required(),
        cifNif: Joi.string().required(),
        companyName: Joi.string().optional().allow("", null)
    })
}

export const verifyExistsReqSchema = {
    body: Joi.object({
        email: Joi.string().required(),
        countryCode: Joi.string().required(),
        phoneNumber: Joi.string().required()
    })
}

export const loginReqSchema = {
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}
