import { Router } from 'express';
import FormController from '@/controllers/form.controller';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class FormRoute implements Routes {
    public path = '/form';
    public router = Router();
    public formController = new FormController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/view`, authMiddleware, this.formController.getForm);
        this.router.get(`${this.path}/test`, this.formController.getTestForm);
        this.router.post(`${this.path}/`, this.formController.saveForm);
    }
}

export default FormRoute;
