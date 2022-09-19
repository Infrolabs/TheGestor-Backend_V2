import { ETaxStatus, ETaxType } from "@/interfaces/tax.interface";
import { Joi } from "express-validation";

export const getTaxesListSchema = {
    query: Joi.object({
        year: Joi.number().required(),
        trimester: Joi.number().required(),
    })
}

export const getTxtSchema = {
    query: Joi.object({
        year: Joi.number().required(),
        trimester: Joi.number().required(),
        type: Joi.string().valid(...Object.values(ETaxType)).required(),
    })
}

export const updateTaxSchema = {
    body: Joi.object({
        year: Joi.number().required(),
        trimester: Joi.number().required(),
        type: Joi.string().valid(...Object.values(ETaxType)).required(),
        status: Joi.string().valid(...Object.values(ETaxStatus)).optional().allow("", null),
        data: Joi.object().optional().allow(null),
        note: Joi.string().optional().allow("", null),
    })
}