import { NextFunction, Request, Response } from 'express';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import AdminService from '@/services/admin.service';
import { IAdmin } from '@/interfaces/admin.interface';

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
}

export default AdminController;