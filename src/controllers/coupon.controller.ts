import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseMessages } from '@/interfaces/response.interface';
import CouponService from '@/services/coupon.service';
import { filterCoupon } from '@/utils/filters';
import { NextFunction, Request, Response } from 'express';

class CouponController {
    private couponService = new CouponService()
    public applyCoupon = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const { coupon, planType, planId } = req.query
            const couponObj = await this.couponService.applyCoupon(String(coupon), String(planType), String(planId), req.user)
            res.success(ResponseMessages.en.COUPON_APPLIED_SUCCESS,filterCoupon(couponObj))
        } catch (error) {
            next(error);
        }
    };
}

export default CouponController;
