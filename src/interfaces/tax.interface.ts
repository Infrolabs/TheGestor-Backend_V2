export interface ITax {
    _id?: string
    year?: number
    trimester?: number
    status?: ETaxStatus
    userId?: string
    type?: ETaxType
    data?: Object
    note?: string
}


// ------- ENUMS ----------------
export enum ETaxStatus {
    PENDING = "pending",
    PRESENTED = "presented"
}

export enum ETaxType {
    FORM303 = 'form303',
    FORM130 = 'form130',
    FORM111 = 'form111',
}