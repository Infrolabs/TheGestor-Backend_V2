import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AdminController from '@/controllers/admin.controller';
import { validate } from 'express-validation';
import { adminLoginReqSchema } from '@/validations/admin.validation';

class AdminRoute implements Routes {
    public path = '/admin';
    public router = Router();
    public adminController = new AdminController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validate(adminLoginReqSchema), this.adminController.login);
    }
}

export default AdminRoute;
