import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { AdminDataStoredInToken, DataStoredInToken, IUserRequest } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import adminModel from '@/models/admin.model';

const authMiddleware = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const Authorization = (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (verify(Authorization, secretKey)) as any;

      if (verificationResponse.admin?.id) {
        const adminId = verificationResponse.admin?.id
        const admin = await adminModel.findById(adminId)
        if (admin) {
          req.admin = admin
          next()
        } else {
          next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.en.WRONG_AUTH_TOKEN));
        }
        return
      }

      const userId = verificationResponse.user?.id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        req.authToken = Authorization
        next();
      } else {
        next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.en.WRONG_AUTH_TOKEN));
      }
    } else {
      next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.en.AUTH_TOKEN_MISSING));
    }
  } catch (error) {
    next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.en.WRONG_AUTH_TOKEN));
  }
};

export default authMiddleware;
