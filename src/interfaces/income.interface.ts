import { EPaymentMethod, IInvoiceAttachment, IInvoiceItem, IManualClient, IManualItem } from "./invoice.interface"

export interface IIncome {
    _id: string
    client: string
    invoiceID: string
    manualClient: IManualClient
    manualItem: IManualItem[]
    invoiceNo: string
    invoiceDate: Date
    dueDate: Date
    paymentMethod: EPaymentMethod
    notes: string
    subTotal: number
    total: number
    vat: number
    irpf: number
    vatInfo: IIncomeVatInfo
    items: IInvoiceItem[]
    attachments: IInvoiceAttachment[]
    isEquivalance: boolean
    createdBy: string
    isDraft: boolean
    isDeleted: boolean
    isReconciled: boolean
    transactionDetails: Object
    comments: IComment[]
    commentStatus: ECommentStatus
}
export interface IIncomeVatInfo {
    vat4: number
    vat10: number
    vat21: number
}

export interface IComment {
    name: string
    userId: string
    message: string
    sentAt: Date
}

export enum ECommentStatus {
    UNREAD = 'unread',
    READ = 'read',
    SOLVED = 'solved'
}