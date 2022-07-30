export interface IBankAccountInfo {
    user: string
    accountId: string
    remittanceInformationUnstructured: string
    bookingDate: string
    transactionAmount: IBankTransactionAmount
    details: Object
    isReconciled: boolean
    income: string
    expense: string
    incomes: string[]
    expenses: string[]
    status: EBankTransactionStatus
}

export interface IBankTransactionAmount {
    amount: string
    currency: string
}

// ------------- ENUMS ----------------------
export enum EBankTransactionStatus {
    BOOKED = "booked",
    PENDING = "pending"
}