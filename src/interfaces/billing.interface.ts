export interface IBilling {
    _id?: string
    user?: string
    name?: string
    orderNo?: string
    invoiceNo?: string
    address?: string
    cifNif?: string
    email?: string
    province?: string
    country?: string
    zipCode?: string
    city?: string
    planId?: string
    expiryDate?: Date
    amount?: number
    unitCost?: number
    subTotal?: number
    vat?: number
    discount?: number
    units?: number
    coupon?: string
    planType?: EPlanType
    paymentStatus?: EBillingPaymentStatus
    subscriptionStatus?: ESubscriptionStatus
    transactionDetails?: any
    errorDetails?: any
}


// ----------- ENUMS ---------
export enum EPlanType {
    MONTHLY = "monthly",
    YEARLY = "yearly"
}

export enum EBillingPaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    ERROR = 'error',
    UNPAID = 'unpaid'
}

export enum ESubscriptionStatus {
    RECURRING = 'recurring',
    CANCELED = 'canceled'
}