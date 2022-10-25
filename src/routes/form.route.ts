import { Router } from 'express';
import FormController from '@/controllers/form.controller';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { editAuthorityMiddleware, readAuthorityMiddleware } from '@/middlewares/authority.middleware';
import { validate } from 'express-validation';
import { formListSchema, formViewSchema } from '@/validations/form.validation';

class FormRoute implements Routes {
    public path = '/form';
    public router = Router();
    public formController = new FormController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/list`, authMiddleware, readAuthorityMiddleware, validate(formListSchema), this.formController.getFormList);
        this.router.get(`${this.path}/view`, authMiddleware, editAuthorityMiddleware, validate(formViewSchema), this.formController.getForm);
        this.router.get(`${this.path}/test`, this.formController.getTestForm);
        this.router.post(`${this.path}/`, this.formController.saveForm);
    }
}

export default FormRoute;
