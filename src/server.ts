import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import PlanRoute from '@routes/plan.route';
import CouponRoute from '@routes/coupon.route';
import BillingRoute from '@routes/billing.route';
import FormRoute from '@routes/form.route';
import TaxRoute from '@routes/tax.route';
import validateEnv from '@utils/validateEnv';
import AppConfigRoute from '@routes/app.config.route';
import IncomeRoute from '@routes/income.route';
import ExpenseRoute from '@routes/expense.route';
import AdminRoute from './routes/admin.route';

validateEnv();

const app = new App([
    new IndexRoute(), 
    new AdminRoute(),
    new AppConfigRoute(),
    new AuthRoute(),
    new PlanRoute(),
    new CouponRoute(),
    new BillingRoute(),
    new FormRoute(),
    new TaxRoute(),
    new IncomeRoute(),
    new ExpenseRoute(),
]);

app.listen();
