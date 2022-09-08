import { IUserRequest } from '@/interfaces/auth.interface';
import { IApiResponse, ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
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
            const txtData = await this.taxService.generateTxt(type, year, trimester, req.user._id)
            res.attachment(type + " " + trimester + " " + year + ".txt")
            res.type('txt')
            res.send(txtData)
        } catch (error) {
            next(error);
        }
    }
}

export default TaxController;
