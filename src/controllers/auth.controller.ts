import { NextFunction, Request, Response } from 'express';
import { IUserRequest } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';

class AuthController {
  public authService = new AuthService();

  public verifyExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData: IUser = {
        email: req.body.email,
        countryCode: req.body.countryCode,
        phoneNumber: req.body.phoneNumber
      }
      await this.authService.verifyExists(reqData);
      res.status(ResponseCodes.SUCCESS).json({ message: ResponseMessages.OTP_SENT });
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData: IUser = {
        name: req.body.name,
        email: req.body.email,
        countryCode: req.body.countryCode,
        phoneNumber: req.body.phoneNumber,
        userType: req.body.userType,
        password: req.body.password,
        cifNif: req.body.cifNif,
        companyName: req.body.companyName
      }
      const { token, user } = await this.authService.signup(reqData, req.body.otp)
      res.status(ResponseCodes.SUCCESS).json({ data: { token, user }, message: ResponseMessages.SIGNUP_SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqData: IUser = {
        email: req.body.email,
        password: req.body.password
      }
      const { token, user } = await this.authService.login(reqData)

      res.status(ResponseCodes.SUCCESS).json({ data: { token, user }, message: ResponseMessages.LOGIN_SUCCESS });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
