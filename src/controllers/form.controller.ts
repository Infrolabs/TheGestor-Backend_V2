import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseMessages } from '@/interfaces/response.interface';
import FormService from '@/services/form.service';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

class FormController {
    private formService = new FormService()
    public getTestForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taxData = await this.formService.getTestFormData()
            res.set('Content-Type', 'text/html')
            res.render('testform', taxData)
        } catch (error) {
            next(error);
        }
    }

    public saveTestForm = async (req: Request, res: IApiResponse, next: NextFunction) => {
        try {
            await this.formService.saveTestFormData(req.body.data)
            res.success(ResponseMessages.en.SIGNUP_SUCCESS)
        } catch (error) {
            next(error);
        }
    }
}

export default FormController;
