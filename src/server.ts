import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import PlanRoute from '@routes/plan.route';
import CouponRoute from '@routes/coupon.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
    new IndexRoute(), 
    new AuthRoute(),
    new PlanRoute(),
    new CouponRoute(),
]);

app.listen();
