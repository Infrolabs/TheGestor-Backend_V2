import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { validate } from 'express-validation'
import ExpenseController from '@/controllers/expense.controller';
import { readAuthorityMiddleware } from '@/middlewares/authority.middleware';
import { changeCommentStatus, postComment } from '@/validations/expense.validation';

class ExpenseRoute implements Routes {
    public path = '/expense';
    public router = Router();
    public expenseController = new ExpenseController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/comment/:incomeId`, authMiddleware, readAuthorityMiddleware, validate(postComment), this.expenseController.addComment);
        this.router.put(`${this.path}/comment-status/:incomeId`, authMiddleware, readAuthorityMiddleware, validate(changeCommentStatus), this.expenseController.changeCommentStatus);
    }
}

export default ExpenseRoute;
