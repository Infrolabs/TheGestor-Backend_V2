import { IUserRequest } from '@/interfaces/auth.interface';
import { ApiResponse, ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import { ELanguage } from '@/interfaces/users.interface';
import PlanService from '@/services/plan.service';
import { NextFunction, Response } from 'express';

class PlanController {
    private planService = new PlanService()
    public list = async (req: IUserRequest, res: ApiResponse, next: NextFunction) => {
        try {
            const plans = await this.planService.getPlanList(req.user.userType, req.user.language || ELanguage.ES)
            res.success(ResponseMessages.en.PLANS_FOUND,plans)
        } catch (error) {
            next(error);
        }
    }
}

export default PlanController;
