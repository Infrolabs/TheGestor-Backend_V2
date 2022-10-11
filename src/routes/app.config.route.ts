import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AppConfigController from '@/controllers/app.config.controller';

class AppConfigRoute implements Routes {
  public path = '/config';
  public router = Router();
  public appConfigController = new AppConfigController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.appConfigController.getConfig);
  }
}

export default AppConfigRoute;
