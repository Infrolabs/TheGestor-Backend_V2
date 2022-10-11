import { Router } from 'express';
import TaxController from '@/controllers/tax.controller';
import { Routes } from '@/interfaces/routes.interface';
import { validate } from 'express-validation';
import { getTaxesListSchema, getTxtSchema, updateTaxSchema } from '@/validations/tax.validation';
import authMiddleware from '@/middlewares/auth.middleware';

class FormRoute implements Routes {
    public path = '/tax';
    public router = Router();
    public taxController = new TaxController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/list`, authMiddleware, validate(getTaxesListSchema), this.taxController.list);
        this.router.get(`${this.path}/txt`,authMiddleware,validate(getTxtSchema), this.taxController.getTxt);
        this.router.put(`${this.path}/`, authMiddleware, validate(updateTaxSchema), this.taxController.addUpdateTax);
        this.router.delete(`${this.path}/reset`, authMiddleware, validate(getTxtSchema), this.taxController.resetTax);
    }
}

export default FormRoute;
