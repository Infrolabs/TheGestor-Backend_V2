import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import PlanRoute from '@routes/plan.route';
import CouponRoute from '@routes/coupon.route';
import BillingRoute from '@routes/billing.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
    new IndexRoute(), 
    new AuthRoute(),
    new PlanRoute(),
    new CouponRoute(),
    new BillingRoute(),
]);

app.listen();
