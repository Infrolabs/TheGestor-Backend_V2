import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseMessages } from '@/interfaces/response.interface';
import ExpenseService from '@/services/expense.service';
import { NextFunction, Request, Response } from 'express';

class ExpenseController {
    private expenseService = new ExpenseService()
    public addComment = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const updatedExpense = await this.expenseService.addComment(req.user, req.actualUser || req.user, req.params.incomeId, req.body.message)
            res.success(ResponseMessages.en.COMMENT_ADDED, updatedExpense.comments)
        } catch (error) {
            next(error);
        }
    };

    public changeCommentStatus = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            this.expenseService.changeCommentStatus(req.user._id, req.params.incomeId, req.body.status)
            res.success(ResponseMessages.en.COMMENT_STATUS_CHANGED)
        } catch (error) {
            next(error);
        }
    };
}

export default ExpenseController;
