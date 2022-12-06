import { REDSYS_PAYMENT_STATUS_CHECK_MINS } from '@/config'
import { EBillingPaymentStatus, IBilling } from '@/interfaces/billing.interface'
import { EPremiumType } from '@/interfaces/premium.interface'
import billingModel from '@/models/billing.model'
import userModel from '@/models/users.model'
import { logger } from '@/utils/logger'
import schedule from 'node-schedule'
import RedsysService from './redsys.service'

class CronService {
    private redsysService = new RedsysService()
    public rescheduleAllJobs() {
        // ======>> For PREMIUM users expiry
        // Schedule corn every day at 9:00
        schedule.scheduleJob("Premium", "0 0 9 * * *", () => {
            this.premiumRenewJob()
        })
    }

    public checkForPayment(billing: IBilling) {
        const time = billing.createdAt
        time.setMinutes(time.getMinutes() + (Number(REDSYS_PAYMENT_STATUS_CHECK_MINS) || 15))
        schedule.scheduleJob(String(billing._id), time, async () => {
            const updatedBilling = await billingModel.findById(billing._id).lean()
            if (updatedBilling.paymentStatus === EBillingPaymentStatus.PENDING)
                this.redsysService.checkPaymentStatus(updatedBilling)
        })
    }


    private async premiumRenewJob() {
        logger.info("======>> Premium cron started")
        const endDate = new Date()
        endDate.setHours(9, 0, 0, 0)
        const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
        const users = await userModel.aggregate([
            {
                $lookup: {
                    from: "billings",
                    localField: "lastBilling",
                    foreignField: "_id",
                    as: "lastBilling"

                }
            },
            { $unwind: "$lastBilling" },
            {
                $match: {
                    $or: [
                        { "lastBilling.expiryDate": { $lt: endDate, $gte: startDate } },
                        { "lastBilling.retryOn": { $lt: endDate, $gte: startDate } }
                    ]
                }
            }

        ])
        logger.info(`======>> Premium expired : ${JSON.stringify(users.map(u => u._id))}`)
        let i = 0
        for (; i < users.length; i++) {
            this.redsysService.renewPremium(users[i].lastBilling)
        }
        // Remove trial uers
        await userModel.updateMany({ trialExpiryDate: { $lt: new Date() }, premiumType: EPremiumType.TRIAL }, { $set: { premiumType: EPremiumType.FREE } })
        logger.info("======>> Premium cron ended")
    }

}

export default CronService