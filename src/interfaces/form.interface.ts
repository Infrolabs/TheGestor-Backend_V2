import { ETaxStatus, ETaxType } from "./tax.interface";

export interface IForm {
    authToken: string
    userId: string
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

export interface ITaxForm {
    type: ETaxType
    data: Object
    year: number
    trimester: number
    status: ETaxStatus
    formDetails: IFormDetails
}

export interface IFormDetails {
    _id: string
    type: string
    name: string
    dueDate: string
}

export const AVAILABLE_FORMS = [
    {
        _id: 'form303',
        en: {
            name: "Form 303",
            type: "VAT",
        },
        es: {
            name: "Modelo 303",
            type: "IVA",
        }
    },
    {
        _id: 'form130',
        en: {
            name: "Form 130",
            type: "IRPF",
        },
        es: {
            name: "Modelo 130",
            type: "IRPF",
        }
    },
    {
        _id: 'form111',
        en: {
            name: "Form 111",
            type: "Retention From Providers",
        },
        es: {
            name: "Modelo 111",
            type: "Retención de Proveedores",
        }
    },
    {
        _id: 'form115',
        en: {
            name: "Form 115",
            type: "Retentions from leasing",
        },
        es: {
            name: "Modelo 115",
            type: "Retenciones del arrendamiento",
        }
    }
]