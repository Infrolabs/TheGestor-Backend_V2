import { EPlanType } from "./billing.interface"

export interface ICoupon {
    _id: string
    code: string
    planType: EPlanType
    planId: string
    discountPercent: number
    units: number
    isPublic: boolean
    users: string[]
    isDeleted: boolean
}