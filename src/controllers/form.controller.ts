import { API_BASE_URL } from '@/config';
import { HttpException } from '@/exceptions/HttpException';
import { IUserRequest } from '@/interfaces/auth.interface';
import { AVAILABLE_FORMS, IForm } from '@/interfaces/form.interface';
import { IApiResponse, ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import { ETaxType } from '@/interfaces/tax.interface';
import FormService from '@/services/form.service';
import { NextFunction, Request, Response } from 'express';

class FormController {
    private formService = new FormService()
    public getFormList = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const list = await this.formService.getFormList(req.user, Number(req.query.year), Number(req.query.trimester))
            res.success(ResponseMessages.en.FORMS_FETCHED, list)
        } catch (error) {
            next(error);
        }
    }

    public getForm = async (req: IUserRequest, res: Response, next: NextFunction) => {
        try {
            const taxData = await this.formService.getFormData(req.authToken, req.user, req.query.type as ETaxType, Number(req.query.year), Number(req.query.trimester))
            res.set('Content-Type', 'text/html')
            res.render(String(req.query.type), taxData)
        } catch (error) {
            next(error);
        }
    }

    public saveForm = async (req: Request, res: IApiResponse, next: NextFunction) => {
        try {
            await this.formService.saveFormData(req.body)
            res.success(ResponseMessages.en.SIGNUP_SUCCESS)
        } catch (error) {
            next(error);
        }
    }

    public getTestForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const formData: IForm = {
                authToken: "1234",
                userId: "1234",
                postUrl: "#",
                imageBaseUrl: API_BASE_URL + "/static/img",
                cssUrl: API_BASE_URL + "/static/css/" + req.query.type + ".css",
                jsUrl: API_BASE_URL + "/static/js/" + req.query.type + ".js",
                formType: req.query.type as ETaxType,
                year: 2022,
                trimester: 1,
                cifNif: "12345",
                fullname: "Test Surname",
                name: "Test",
                surname: "Surname",
                data: {}
            }
            res.set('Content-Type', 'text/html')
            res.render(req.query.type as string, formData)
        } catch (error) {
            next(error);
        }
    }
}

export default FormController;
