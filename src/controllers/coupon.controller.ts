import { IUserRequest } from '@/interfaces/auth.interface';
import { EPlanType } from '@/interfaces/billing.interface';
import { ICoupon } from '@/interfaces/coupon.interface';
import { IApiResponse, ResponseMessages } from '@/interfaces/response.interface';
import CouponService from '@/services/coupon.service';
import { filterCoupon } from '@/utils/filters';
import { NextFunction, Request, Response } from 'express';

class CouponController {
    private couponService = new CouponService()
    public createCoupon = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const reqData: ICoupon = {
                code: req.body.code,
                planId: req.body.planId,
                planType: req.body.planType,
                discountPercent: req.body.discountPercent,
                isPublic: req.body.isPublic,
                users: req.body.users,
                units: req.body.units,
            }
            const couponObj = await this.couponService.createCoupon(reqData)
            res.success(ResponseMessages.en.COUPON_CREATED, filterCoupon(couponObj))
        } catch (error) {
            next(error);
        }
    };

    public applyCoupon = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const { coupon, planType, planId } = req.query
            const couponObj = await this.couponService.applyCoupon(String(coupon), String(planId), (planType as EPlanType), req.user)
            res.success(ResponseMessages.en.COUPON_APPLIED_SUCCESS, filterCoupon(couponObj))
        } catch (error) {
            next(error);
        }
    };
}

export default CouponController;
