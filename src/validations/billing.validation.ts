import { EBillingPaymentStatus, EPlanType } from "@/interfaces/billing.interface";
import { Joi } from "express-validation";

export const billingCreateSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        cifNif: Joi.string().required(),
        email: Joi.string().required(),
        province: Joi.string().required(),
        address: Joi.string().required(),
        country: Joi.string().required(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        planId: Joi.string().required(),
        planType: Joi.string().valid(...Object.values(EPlanType)).required(),
        amount: Joi.number().required(),
        units: Joi.number().required(),
        coupon: Joi.string().optional(),
    })
}

export const billingUpdateSchema = {
    body: Joi.object({
        paymentStatus: Joi.string().valid(...Object.values(EBillingPaymentStatus)).required(),
        transactionDetails: Joi.object().optional().allow(null),
        errorDetails: Joi.object().optional().allow(null)
    })
}

export const billingUnpaidFormSchema = {
    query: Joi.object({
        billingIds: Joi.string().required()
    })
}

export const billingUpdateUnpaidSchema = {
    body: Joi.object({
        billingIds: Joi.array().items(Joi.string()).required(),
        transactionDetails: Joi.object().optional().allow(null)
    })
}
