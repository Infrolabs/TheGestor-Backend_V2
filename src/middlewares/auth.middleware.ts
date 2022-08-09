import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, IUserRequest } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';

const authMiddleware = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.WRONG_AUTH_TOKEN));
      }
    } else {
      next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.AUTH_TOKEN_MISSING));
    }
  } catch (error) {
    next(new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.WRONG_AUTH_TOKEN));
  }
};

export default authMiddleware;
