import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { validate } from 'express-validation'
import BillingController from '@/controllers/billing.controller';
import { billingCreateSchema, billingUnpaidFormSchema, billingUpdateSchema, billingUpdateUnpaidSchema } from '@/validations/billing.validation';
import { adminAuthorityMiddleware } from '@/middlewares/authority.middleware';

class BillingRoute implements Routes {
    public path = '/billing';
    public router = Router();
    public billingController = new BillingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/`, authMiddleware, adminAuthorityMiddleware, validate(billingCreateSchema), this.billingController.createBilling);
        this.router.put(`${this.path}/unpaid-bills`, authMiddleware, adminAuthorityMiddleware, validate(billingUpdateUnpaidSchema), this.billingController.updateUnpaidBilling);
        this.router.put(`${this.path}/:id`, authMiddleware, adminAuthorityMiddleware, validate(billingUpdateSchema), this.billingController.updateBilling);
        this.router.get(`${this.path}/form/:id`, this.billingController.getForm);
        this.router.get(`${this.path}/unpaid-form`, validate(billingUnpaidFormSchema), this.billingController.getUnpaidForm);
        this.router.get(`${this.path}/list`, authMiddleware, adminAuthorityMiddleware, this.billingController.getBillingList);
        this.router.delete(`${this.path}/subscription`, authMiddleware, adminAuthorityMiddleware, this.billingController.cancelSubscription);
    }
}

export default BillingRoute;
