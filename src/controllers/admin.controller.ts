import { NextFunction, Request, Response } from 'express';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import AdminService from '@/services/admin.service';
import { IAdmin } from '@/interfaces/admin.interface';
import { EPremiumType } from '@/interfaces/premium.interface';
import { EBillingPaymentStatus } from '@/interfaces/billing.interface';

class AdminController {
    public adminService = new AdminService();
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const adminData: IAdmin = {
                email: req.body.email,
                password: req.body.password
            }
            const data = await this.adminService.login(adminData);
            res.status(ResponseCodes.SUCCESS).json({ data, message: ResponseMessages.en.LOGIN_SUCCESS });
        } catch (error) {
            next(error);
        }
    }

    public usersList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.adminService.usersList(String(req.query.search), req.query.premiumType as EPremiumType, Number(req.query.skip) || 0, Number(req.query.limit) || 20);
            res.status(ResponseCodes.SUCCESS).json({ data, message: ResponseMessages.en.USERS_FETCHED });
        } catch (error) {
            next(error);
        }
    }

    public billingList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.adminService.billingList(req.query.paymentStatus as EBillingPaymentStatus, Number(req.query.skip) || 0, Number(req.query.limit) || 20);
            res.status(ResponseCodes.SUCCESS).json({ data, message: ResponseMessages.en.BILLING_FETCHED });
        } catch (error) {
            next(error);
        }
    }
}

export default AdminController;