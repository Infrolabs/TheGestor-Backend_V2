import { Joi } from "express-validation";

export const formListSchema = {
    query: Joi.object({
        year: Joi.number().required(),
        trimester: Joi.number().required(),
    })
}