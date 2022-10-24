import { IAdmin } from "@/interfaces/admin.interface";
import { IBilling } from "@/interfaces/billing.interface";
import { ICoupon } from "@/interfaces/coupon.interface";
import { IBillingPlan } from "@/interfaces/plan.interface";
import { ELanguage, IUser } from "@/interfaces/users.interface";

export const filterCurrentUser = (user: IUser): IUser => {
    delete user.password
    return user
}

export const filterAdmin = (user: IAdmin): IAdmin => {
    delete user.password
    delete user.isDeleted
    return user
}

export const filterPlans = (plans: IBillingPlan[], language: ELanguage): IBillingPlan[] => {
    const result : IBillingPlan[] = []
    plans.forEach(plan => {
        result.push({
            id: plan.id,
            name: plan.name,
            userType: plan.userType,
            description: plan.description[language] ? plan.description[language] : plan.description[ELanguage.ES],
            features: plan.features[language] ? plan.features[language] : plan.features[ELanguage.ES],
            amount: plan.amount
        })
    })
    return result
}

export const filterCoupon = (coupon: ICoupon): ICoupon => {
    return {
        code: coupon.code,
        planId: coupon.planId,
        planType: coupon.planType,
        discountPercent: coupon.discountPercent,
        units: coupon.units
    }
}

export const filterBillings = (billings: IBilling[]): IBilling[] => {
    const result: IBilling[] = []
    billings.forEach(billing => {
        result.push(filterBilling(billing))
    })
    return result
}

export const filterBilling = (billing: IBilling): IBilling => {
    return {
        _id: billing._id,
        name: billing.name,
        orderNo: billing.orderNo,
        invoiceNo: billing.invoiceNo,
        address: billing.address,
        cifNif: billing.cifNif,
        email: billing.email,
        province: billing.province,
        country: billing.country,
        zipCode: billing.zipCode,
        city: billing.city,
        planId: billing.planId,
        expiryDate: billing.expiryDate,
        amount: billing.amount,
        unitCost: billing.unitCost,
        subTotal: billing.subTotal,
        vat: billing.vat,
        discount: billing.discount,
        units: billing.units,
        coupon: billing.coupon,
        planType: billing.planType,
        paymentStatus: billing.paymentStatus,
        subscriptionStatus: billing.subscriptionStatus,
        createdAt: billing.createdAt
    }
}