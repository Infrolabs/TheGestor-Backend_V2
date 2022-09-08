import { Joi } from "express-validation";

export const getTaxesListSchema = {
    query: Joi.object({
        year: Joi.number().required(),
        trimester: Joi.number().required(),
    })
}