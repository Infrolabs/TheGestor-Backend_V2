import { ETaxType } from "@/interfaces/tax.interface";
import { Joi } from "express-validation";

export const formListSchema = {
    query: Joi.object({
        year: Joi.number().required(),
        trimester: Joi.number().required(),
    })
}

export const formViewSchema = {
    query: Joi.object({
        type: Joi.string().valid(...Object.values(ETaxType)).required(),
        year: Joi.number().required(),
        trimester: Joi.number().required(),
    })
}