import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AdminController from '@/controllers/admin.controller';
import { validate } from 'express-validation';
import { adminLoginReqSchema, adminUsersReqSchema } from '@/validations/admin.validation';
import adminAuthMiddleware from '@/middlewares/admin.auth.middleware';

class AdminRoute implements Routes {
    public path = '/admin';
    public router = Router();
    public adminController = new AdminController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validate(adminLoginReqSchema), this.adminController.login);
        this.router.get(`${this.path}/users`, adminAuthMiddleware, validate(adminUsersReqSchema), this.adminController.usersList);
    }
}

export default AdminRoute;
