import { NextFunction, Request, Response } from 'express';
import AppConfigService from '@/services/app.config.service';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';

class AppConfigController {
    public appConfigService = new AppConfigService();
    public getConfig = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const config = await this.appConfigService.getConfig();
            res.status(ResponseCodes.SUCCESS).json({ data: config, message: ResponseMessages.en.CONFIG_FETCHED });
        } catch (error) {
            next(error);
        }
    }
}

export default AppConfigController;