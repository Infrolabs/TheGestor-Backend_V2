import { ETaxType } from "./tax.interface";

export interface IForm {
    authToken: string
    postUrl: string
    imageBaseUrl: string
    jsUrl: string
    cssUrl: string
    formType: ETaxType
    data: Object
    name: string
    surname: string
    cifNif: string
    year: number
    trimester: number
}