import { HttpException } from '@/exceptions/HttpException';
import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import { ETaxType } from '@/interfaces/tax.interface';
import FormService from '@/services/form.service';
import { NextFunction, Request, Response } from 'express';

class FormController {
    private formService = new FormService()
    public getForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.query.type !== ETaxType.FORM111)
                throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.FORM_NOT_SUPPORTED)
            const taxData = await this.formService.getFormData(null, req.query.type as ETaxType, Number(req.query.year), Number(req.query.trimester))
            res.set('Content-Type', 'text/html')
            console.log(taxData)
            res.render(req.query.type, taxData)
        } catch (error) {
            next(error);
        }
    }

    public saveForm = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            await this.formService.saveFormData(req.body)
            res.success(ResponseMessages.en.SIGNUP_SUCCESS)
        } catch (error) {
            next(error);
        }
    }
}

export default FormController;
