import { IUserBizum } from "./users.interface"

export interface IInvoice {
    createdBy: string
    client: string
    saved: boolean
    isEquivalance: boolean
    manualClient: IManualClient
    manualItem: IManualItem[]
    isManuallyCreated: boolean
    invoiceNo: string
    invoiceDate: Date
    dueDate: Date
    additionalDetails: string
    paymentMethod: EPaymentMethod
    bankName: string
    accountHolder: string
    iban: string
    swiftCode: string
    status: EInvoiceStatus
    template: EInvoiceTemplate
    subTotal: number
    vat: number
    irpf: number
    total: number
    items: IInvoiceItem[]
    bizum: IUserBizum
    bizumNo: string
    attachments: IInvoiceAttachment[]
    isDeleted: boolean
}

export interface IManualClient {
    name: string
    address: string
    cifNif: string
}

export interface IManualItem {
    name: string
    cost: number
    unit: number
    vat: number
    irpf: number
    vatName: string
    vatType: EVatType
}

export interface IInvoiceAttachment {
    name: string
    url: string
    date: string
    size: string
    type: string
}

export interface IInvoiceItem {
    itemType: string
    name: string
    description: string
    reference: string
    quantity: number
    serviceType: string
    cost: number
    vat: number
    irpf: number
    selectedQuantity: number
    vatType: EVatType
}

// ------------- ENUMS ------------
export enum EInvoiceStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    UNPAID = 'unpaid',
    PAID = 'paid'
}

export enum EInvoiceTemplate {
    MODERN = 'modern_invoice',
    SIMPLE = 'simple_invoice',
    MINIMSLIST = 'minimalist_invoice'
}

export enum EVatType {
    STANDARD_21 = "standard_21",
    REDUCED_10 = "reduced_10",
    SUPER_REDUCED_4 = "super_reduced_4",
    WITHOUT_0 = "without_0",
    STANDARD_21_52 = "standard_21_52",
    REDUCED_10_14 = "reduced_10_14",
    SUPER_REDUCED_4_05 = "super_reduced_4_05",
    INTRA_COM_21 = "intra_community_21",
    INTRA_COM_10 = "intra_community_10",
    INTRA_COM_4 = "intra_community_4",
    INTRA_COM_0 = "intra_community_0",
    TAX_REVARSAL_0 = "tax_revarsal_0",
    IMPORT_0 = "import_0"
}

export enum EPaymentMethod {
    CASH = "Cash",
    CARD = "Card",
    BANK = "Bank Transfer",
    STRIPE = "Stripe",
    BIZUM = "Bizum",
}

export enum EPaymentMethodEs {
    CASH = "Efectivo",
    CARD = "Tarjeta",
    BANK = "Transferencia Bancaria",
    STRIPE = "Stripe",
    BIZUM = "Bizum",
}