import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validate } from 'express-validation';
import { verifyExistsReqSchema } from '@/validations/auth.validation';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}verify-exists`, validate(verifyExistsReqSchema), this.authController.verifyExists);
    this.router.post(`${this.path}signup`, this.authController.signUp);
    this.router.post(`${this.path}login`, this.authController.logIn);
  }
}

export default AuthRoute;
