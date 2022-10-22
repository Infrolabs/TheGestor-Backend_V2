import { EPaymentMethod, IInvoiceAttachment, IInvoiceItem, IManualClient, IManualItem } from "./invoice.interface"

export interface IExpense {
    _id: string
    invoiceNo: string
    manualClient: IManualClient
    manualItem: IManualItem[]
    isDraft: boolean
    typeExpense: EExpenseType
    isEquivalance: boolean
    invoiceDate: Date
    dueDate: Date
    cifNif: string
    address: string
    paymentMethod: EPaymentMethod
    notes: string
    attachments: IInvoiceAttachment[]
    vat: number
    irpf: number
    subTotal: number
    total: number
    items: IInvoiceItem[]
    retentionProviders: number
    retentionRent: number
    client: string
    createdBy: string
    isDeleted: boolean
    isReconciled: boolean
    transactionDetails: Object
    isSimplified: boolean
}

// --------- ENUMS -----------
export enum EExpenseType {
    RENT = 'rent',
    UTILITIES = 'utilities',
    MARKETING = 'marketing',
    INSURANCE = 'insurance',
    TRANSPORT = 'transport',
    FURNITURE = 'furniture',
    ELECTRONICS = 'electronics',
    PROFESSIONAL = 'professional',
    ASSETS = 'assets',
    SOCIAL = 'social',
    OTHERS = 'others',
}

export enum EExpenseTypeEs {
    RENT = "renta",
    UTILITIES = "servicios generales",
    MARKETING = "marketing",
    INSURANCE = "seguros",
    TRANSPORT = "transporte",
    FURNITURE = "muebles",
    ELECTRONICS = "electronica",
    PROFESSIONAL = "profesionales",
    ASSETS = "activos",
    SOCIAL = "sociales",
    OTHERS = "otros"
}

export enum EExpenseColor {
    RENT = '#006eda',
    UTILITIES = '#BD197B',
    MARKETING = '#7B2397',
    INSURANCE = '#EFB762',
    TRANSPORT = '#ffb725',
    FURNITURE = '#7dbfe5',
    ELECTRONICS = '#55B07F',
    PROFESSIONAL = '#EA6059',
    ASSETS = '#28d7bd',
    SOCIAL = '#a82fd0',
    OTHERS = '#e1e7ff',
}
