import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { ValidationError } from 'express-validation'

const errorMiddleware = (error: HttpException | ValidationError, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json(error)
    }
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
