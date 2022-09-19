import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import { ETaxType, ITax } from '@/interfaces/tax.interface';
import TaxService from '@/services/tax.service';
import { NextFunction, Response } from 'express';

class TaxController {
    private taxService = new TaxService()
    public list = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const taxes = await this.taxService.getTaxesList(Number(req.query.year), Number(req.query.trimester), req.user._id)
            res.success(ResponseMessages.en.TAXES_FOUND, taxes)
        } catch (error) {
            next(error);
        }
    }
    public getTxt = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const { type, year, trimester } = req.query
            const txtData = await this.taxService.generateTxt(type as ETaxType, Number(year), Number(trimester), req.user)
            res.attachment(type + " " + trimester + "T " + year + ".txt")
            res.type('txt')
            res.send(txtData)
        } catch (error) {
            next(error);
        }
    }
    public addUpdateTax = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const updateData: ITax = {
                userId: req.user._id,
                year: req.body.year,
                trimester: req.body.trimester,
                type: req.body.type,
                status: req.body.status,
                data: req.body.data,
                note: req.body.note
            }
            const taxes = await this.taxService.addUpdateTax(updateData)
            res.success(ResponseMessages.en.TAXES_FOUND, taxes)
        } catch (error) {
            next(error);
        }
    }
}

export default TaxController;
