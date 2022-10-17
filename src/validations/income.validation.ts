import { ECommentStatus } from "@/interfaces/income.interface";
import { Joi } from "express-validation";
import { ID_REGEX } from "./regex";

export const postComment = {
    body: Joi.object({
        message: Joi.string().required()
    }),
    params:Joi.object({
        incomeId:Joi.string().regex(ID_REGEX).required()
    })
}

export const changeCommentStatus = {
    body: Joi.object({
        status: Joi.string().valid(...Object.values(ECommentStatus)).required()
    }),
    params:Joi.object({
        incomeId:Joi.string().regex(ID_REGEX).required()
    })
}