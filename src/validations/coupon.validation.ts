import { EPlanType } from "@/interfaces/billing.interface";
import { Joi } from "express-validation";

export const couponApplySchema = {
    query: Joi.object({
        coupon: Joi.string().required(),
        planType: Joi.string().valid(...Object.values(EPlanType)).required(),
        planId: Joi.string().required()
    })
}