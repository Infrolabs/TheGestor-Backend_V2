import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseMessages } from '@/interfaces/response.interface';
import IncomeService from '@/services/income.service';
import { NextFunction } from 'express';

class IncomeController {
    private incomeService = new IncomeService()
    public addComment = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const updatedIncome = await this.incomeService.addComment(req.user, req.actualUser || req.user, req.params.incomeId, req.body.message)
            res.success(ResponseMessages.en.COMMENT_ADDED, updatedIncome.comments)
        } catch (error) {
            next(error);
        }
    };

    public changeCommentStatus = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            this.incomeService.changeCommentStatus(req.user._id, req.params.incomeId, req.body.status)
            res.success(ResponseMessages.en.COMMENT_STATUS_CHANGED)
        } catch (error) {
            next(error);
        }
    };
}

export default IncomeController;
