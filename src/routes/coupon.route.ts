import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import CouponController from '@/controllers/coupon.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { validate } from 'express-validation';
import { couponApplySchema } from '@/validations/coupon.validation';

class CouponRoute implements Routes {
  public path = '/coupon';
  public router = Router();
  public couponController = new CouponController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/apply`,authMiddleware,validate(couponApplySchema), this.couponController.applyCoupon);
  }
}

export default CouponRoute;
