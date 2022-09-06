import { Router } from 'express';
import FormController from '@/controllers/form.controller';
import { Routes } from '@/interfaces/routes.interface';

class FormRoute implements Routes {
    public path = '/form';
    public router = Router();
    public formController = new FormController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/test`, this.formController.getTestForm);
        this.router.post(`${this.path}/test`, this.formController.saveTestForm);
    }
}

export default FormRoute;
