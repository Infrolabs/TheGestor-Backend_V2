import { ETaxType } from "./tax.interface";

export interface IForm {
    postUrl: string
    modelBackgroundImage: string
    currencyformaterUrl: string
    cssUrl: string
    formType: ETaxType
    data: Object
    name: string
    surname: string
    cifNif: string
    year: number
    trimester: number
}