import { IUserRequest } from "@/interfaces/auth.interface"
import { IBilling } from "@/interfaces/billing.interface"
import { IApiResponse, ResponseMessages } from "@/interfaces/response.interface"
import BillingService from "@/services/billing.service"
import { filterBilling, filterBillings } from "@/utils/filters"
import { NextFunction, Request, Response } from "express"

class BillingController {
    private billingService = new BillingService()
    public createBilling = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const reqData: IBilling = {
                name: String(req.body.name),
                cifNif: String(req.body.cifNif),
                email: String(req.body.email),
                province: String(req.body.province),
                address: String(req.body.address),
                country: String(req.body.country),
                zipCode: String(req.body.zipCode),
                city: String(req.body.city),
                planId: String(req.body.planId),
                planType: req.body.planType,
                amount: req.body.amount,
                units: req.body.units,
                coupon: req.body.coupon
            }
            const billingObj = await this.billingService.createBilling(reqData, req.user)
            res.success(ResponseMessages.en.BILLING_CREATED, filterBilling(billingObj))
        } catch (error) {
            next(error);
        }
    }

    public updateBilling = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const reqData: IBilling = {
                paymentStatus: req.body.paymentStatus,
                errorDetails: req.body.errorDetails,
                transactionDetails: req.body.transactionDetails
            }
            const billingObj = await this.billingService.updateBilling(req.params.id, reqData, req.user)
            res.success(ResponseMessages.en.BILLING_UPDATED, filterBilling(billingObj))
        } catch (error) {
            next(error);
        }
    }

    public updateUnpaidBilling = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const reqData: IBilling = {
                transactionDetails: req.body.transactionDetails
            }
            await this.billingService.updateUnpaidBillings(req.body.billingIds, reqData, req.user)
            res.success(ResponseMessages.en.BILLING_UPDATED)
        } catch (error) {
            next(error);
        }
    }

    public getForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form = await this.billingService.getBillingForm(req.params.id)
            res.set('Content-Type', 'text/html')
            res.render('redsys', form)
        } catch (error) {
            next(error);
        }
    }

    public getUnpaidForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const billingIds = JSON.parse(String(req.query.billingIds))
            const form = await this.billingService.getUnpaidBillingForm(billingIds as string[])
            res.set('Content-Type', 'text/html')
            res.render('redsys', form)
        } catch (error) {
            next(error);
        }
    }

    public getBillingList = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const billings = await this.billingService.getBillingList(req.user._id)
            res.success(ResponseMessages.en.BILLINGS_FOUND, filterBillings(billings))
        } catch (error) {
            next(error);
        }
    }

    public cancelSubscription = async (req: IUserRequest, res: IApiResponse, next: NextFunction) => {
        try {
            const billing = await this.billingService.cancelSubscription(req.user.lastBilling)
            res.success(ResponseMessages.en.SUBSCRIPTION_CANCELED, filterBilling(billing))
        } catch (error) {
            next(error);
        }
    }
}

export default BillingController;
