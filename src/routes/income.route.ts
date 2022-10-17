import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { validate } from 'express-validation'
import IncomeController from '@/controllers/income.controller';
import { readAuthorityMiddleware } from '@/middlewares/authority.middleware';
import { changeCommentStatus, postComment } from '@/validations/income.validation';

class IncomeRoute implements Routes {
    public path = '/income';
    public router = Router();
    public incomeController = new IncomeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/comment/:incomeId`, authMiddleware, readAuthorityMiddleware, validate(postComment), this.incomeController.addComment);
        this.router.put(`${this.path}/comment-status/:incomeId`, authMiddleware, readAuthorityMiddleware, validate(changeCommentStatus), this.incomeController.changeCommentStatus);
    }
}

export default IncomeRoute;
