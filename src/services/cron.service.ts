import { ESubscriptionStatus } from '@/interfaces/billing.interface'
import { EPremiumType } from '@/interfaces/premium.interface'
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
                    "lastBilling.expiryDate": { $lt: endDate, $gte: startDate }
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