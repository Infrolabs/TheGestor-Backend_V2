import { EPlanType } from "@/interfaces/billing.interface";
import { Joi } from "express-validation";

export const couponApplySchema = {
    query: Joi.object({
        coupon: Joi.string().required(),
        planType: Joi.string().valid(...Object.values(EPlanType)).required(),
        planId: Joi.string().required()
    })
}

export const couponCreateSchema = {
    body: Joi.object({
        code:Joi.string().required(), 
        planId:Joi.string().required(), 
        planType:Joi.string().valid(...Object.values(EPlanType)), 
        discountPercent:Joi.number().required(), 
        isPublic:Joi.boolean().required(), 
        users:Joi.array().items(Joi.string()).optional().allow(null), 
        units: Joi.number().required()
    })
}