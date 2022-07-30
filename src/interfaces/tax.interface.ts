export interface ITax {
    _id: string
    pendingTax: string
    vat: string
    irpf: string
    retentionProviders: string
    retentionRent: string
    presentPeriod: Date
    details: string
    year: number
    trimester: number
    cifNif: string
    name: string
    status: string
    userId: string
    type: string
    data: Object,
    note: string
}


// ------- ENUMS ----------------
export enum ETaxStatus {
    PENDING = "pending",
    PRESENTED = "presented"
}

export enum ETaxType {
    FORM303 = 'form303',
    FORM130 = 'form130'
}