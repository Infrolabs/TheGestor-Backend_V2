import { ETaxType } from "@/interfaces/tax.interface";
import { Joi } from "express-validation";

export const couponCreateSchema = {
    body: Joi.object({
        type: Joi.string().valid(...Object.values(ETaxType)).required(),
        year: Joi.number().required(),
        trimester: Joi.number().required(),
        authToken: Joi.string().required()
    }).unknown(true)
}