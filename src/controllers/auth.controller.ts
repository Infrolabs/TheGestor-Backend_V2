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
     // const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: {}, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userData: CreateUserDto = req.body;
      // const { token, findUser } = await this.authService.login(userData);

      res.status(200).json({ data: {}, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
