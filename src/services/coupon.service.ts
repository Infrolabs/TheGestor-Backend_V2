import { HttpException } from "@/exceptions/HttpException";
import { EBillingPaymentStatus, EPlanType } from "@/interfaces/billing.interface";
import { ICoupon } from "@/interfaces/coupon.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/users.interface";
import billingModel from "@/models/billing.model";
import couponModel from "@/models/coupon.model";

class CouponService {
    public async createCoupon(couponData: ICoupon): Promise<ICoupon> {
        let coupon = new couponModel(couponData)
        coupon = await coupon.save()
        return coupon
    }

    public async applyCoupon(coupon: string, planId: string, planType: EPlanType, user: IUser): Promise<ICoupon> {
        const couponObj = await couponModel.findOne({ code: coupon, planId, isDeleted: false })
        if (!couponObj)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.COUPON_NOT_FOUND)
        if (couponObj.planType !== planType)
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.COUPON_INVALID_PLAN)
        if (!couponObj.isPublic && !couponObj.users?.some(usId => String(usId) === String(user._id)))
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.COUPON_CANNOT_REDEEM)
        let billing = await billingModel.findOne({
            user: user._id,
            paymentStatus: EBillingPaymentStatus.PAID,
            coupon: coupon
        })
        if (billing)
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.COUPON_USED)

        return couponObj
    }


}

export default CouponService;
