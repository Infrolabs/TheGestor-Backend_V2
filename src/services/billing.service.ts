import { HttpException } from "@/exceptions/HttpException";
import { EBillingPaymentStatus, EPlanType, ESubscriptionStatus, IBilling } from "@/interfaces/billing.interface";
import { BillinPlans } from "@/interfaces/plan.interface";
import { EPremiumType } from "@/interfaces/premium.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/users.interface";
import billingModel from "@/models/billing.model";
import userModel from "@/models/users.model";
import CouponService from "./coupon.service";
import RedsysService from "./redsys.service";

class BillingService {
    private couponService = new CouponService()
    private redsysService = new RedsysService()

    public async createBilling(billingData: IBilling, user: IUser): Promise<IBilling> {
        if (!BillinPlans.some(plan => plan.id === billingData.planId))
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.PLAN_NOT_FOUND)
        const plan = BillinPlans.find(plan => plan.id === billingData.planId)
        const today = new Date()
        let discountPercent = 0
        if (billingData.coupon) {
            const coupon = await this.couponService.applyCoupon(billingData.coupon, billingData.planId, billingData.planType, user)
            // Check if units are proper
            if (coupon.units && billingData.units !== coupon.units)
                throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.INVALID_COUPON_UNITS)
            discountPercent = coupon.discountPercent
        }
        if (billingData.planType === EPlanType.MONTHLY &&
            billingData.amount === (plan.amount.month - (plan.amount.month * discountPercent / 100)) * billingData.units) {
            billingData.expiryDate = new Date(today.setMonth(today.getMonth() + billingData.units))
            billingData.unitCost = plan.amount.month * 100 / 121
            billingData.subTotal = plan.amount.month * 100 / 121 * billingData.units
            billingData.discount = billingData.subTotal * discountPercent / 100
            billingData.vat = (billingData.subTotal - billingData.discount) * 21 / 100
        } else if (billingData.planType === EPlanType.YEARLY &&
            billingData.amount === (plan.amount.year - (plan.amount.year * discountPercent / 100)) * billingData.units) {
            billingData.expiryDate = new Date(today.getFullYear() + billingData.units, today.getMonth(), today.getDate())
            billingData.unitCost = plan.amount.year * 100 / 121
            billingData.subTotal = plan.amount.year * 100 / 121 * billingData.units
            billingData.discount = billingData.subTotal * discountPercent / 100
            billingData.vat = (billingData.subTotal - billingData.discount) * 21 / 100
        } else {
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.INVALID_BILLING_AMOUNT)
        }

        // Check for unpaid bills
        const unpaidBill = await billingModel.findOne({ user: user._id, paymentStatus: EBillingPaymentStatus.UNPAID })
        if (unpaidBill)
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.UNPAID_BILL_ERROR)

        const orderNo = (await billingModel.countDocuments()) + 1
        billingData.user = user._id
        billingData.orderNo = String(orderNo % 10000).padStart(6, '0') + String(billingData.user).substring(String(billingData.user).length - 6)
        let billing = new billingModel(billingData)
        billing = await billing.save()
        return billing
    }

    public async updateBilling(billingId: string, billingData: IBilling, user: IUser): Promise<IBilling> {
        const billing = await billingModel.findOne({ _id: billingId, user: user._id })
        if (!billing)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.BILL_NOT_FOUND)
        if (billingData.paymentStatus === EBillingPaymentStatus.PAID) {
            if (!this.redsysService.validatePayment(billingData.transactionDetails.Ds_MerchantParameters, billing.amount))
                throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.INVALID_PAYMENT)
            const start = new Date()
            start.setMonth(0, 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date()
            end.setMonth(11, 32)
            end.setHours(0, 0, 0, 0)

            const invoices = await billingModel.countDocuments({ createdAt: { $gte: start, $lt: end }, paymentStatus: { $in: [EBillingPaymentStatus.PAID, EBillingPaymentStatus.UNPAID] } })
            billingData.invoiceNo = (new Date()).getFullYear() + "-INC-" + (String(invoices).padStart(6, "0"))
        }
        const billingNew = await billingModel.findOneAndUpdate({ _id: billingId, user: user._id }, billingData, { new: true })
        if (billingData.paymentStatus === EBillingPaymentStatus.PAID) {
            await userModel.updateOne({ _id: user._id }, { $set: { premiumType: EPremiumType.PREMIUM, lastBilling: billingNew._id } })
        }
        return billingNew
    }

    public async updateUnpaidBillings(billingIds: string[], billingData: IBilling, user: IUser): Promise<void> {
        const billings = await billingModel.find({ _id: { $in: billingIds }, user: user._id })
        if (!billings || billings.length === 0)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.BILL_NOT_FOUND)
        let amount = 0
        billings.forEach(billing => { amount += billing.amount })
        if (!this.redsysService.validatePayment(billingData.transactionDetails.Ds_MerchantParameters, amount))
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.INVALID_PAYMENT)
        billingData.paymentStatus = EBillingPaymentStatus.PAID
        await billingModel.updateMany({ _id: { $in: billingIds } }, billingData, { new: true })
    }

    public async getBillingForm(billingId: string): Promise<any> {
        const billingObj = await billingModel.findById(billingId).lean()
        return this.redsysService.getMerchantParams(billingObj.orderNo, billingObj.amount, billingObj.user, true)
    }

    public async getUnpaidBillingForm(billingIds: string[]): Promise<any> {
        const billings = await billingModel.find({ _id: { $in: billingIds }, paymentStatus: EBillingPaymentStatus.UNPAID }).lean()
        if (billings.length === 0)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.BILL_NOT_FOUND)
        let amount = 0
        billings.forEach(billing => { amount += billing.amount })
        const dateStr = String(new Date().getTime())
        const orderNo = dateStr.substring(dateStr.length - 12)
        return this.redsysService.getMerchantParams(orderNo, amount, billings[0].user)
    }

    public async getBillingList(userId: string): Promise<IBilling[]> {
        const billings = await billingModel.find({ user: userId, paymentStatus: { $in: [EBillingPaymentStatus.PAID, EBillingPaymentStatus.UNPAID] } })
        return billings
    }

    public async cancelSubscription(billingId: string): Promise<IBilling> {
        const billing = await billingModel.findOneAndUpdate({ _id: billingId }, { subscriptionStatus: ESubscriptionStatus.CANCELED }, { new: true })
        return billing
    }

}

export default BillingService;
