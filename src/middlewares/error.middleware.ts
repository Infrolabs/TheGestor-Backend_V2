import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { ValidationError } from 'express-validation'
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import { IUserRequest } from '@/interfaces/auth.interface';

const errorMiddleware = (error: HttpException | ValidationError, req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ code: error.statusCode, error })
    }
    const status: number = error.status || ResponseCodes.INTERNAL_SERVER_ERROR;
    const message: string = error.message || ResponseMessages.en.SOMETHING_WENT_WRONG;
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    // Response message localization
    const respMessage = message && req.user &&
      Object.values(ResponseMessages.en).some(v => v === message) &&
      ResponseMessages[req.user.language]
      ?
      ResponseMessages[req.user.language][Object.keys(ResponseMessages.en).find(key => ResponseMessages.en[key] === message)]
      :
      message
    res.status(status).json({ code: status, message: respMessage, error });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
