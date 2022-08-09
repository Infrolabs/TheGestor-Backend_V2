import { IUserRequest } from '@/interfaces/auth.interface';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import PlanService from '@/services/plan.service';
import { NextFunction, Response } from 'express';

class PlanController {
    private planService = new PlanService()
    public list = async (req: IUserRequest, res: Response, next: NextFunction) => {
        try {
            const plans = await this.planService.getPlanList(req.user.userType)
            res.status(ResponseCodes.SUCCESS).json({ data: plans, message: ResponseMessages.PLANS_FOUND });
        } catch (error) {
            next(error);
        }
    }
}

export default PlanController;
