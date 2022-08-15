import { Router } from 'express';
import PlanController from '@controllers/plan.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { adminAuthorityMiddleware } from '@/middlewares/authority.middleware';

class PlanRoute implements Routes {
    public path = '/plan';
    public router = Router();
    public planController = new PlanController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/list`, authMiddleware, adminAuthorityMiddleware, this.planController.list);
    }
}

export default PlanRoute;
