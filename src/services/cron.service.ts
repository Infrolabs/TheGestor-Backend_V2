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
        schedule.scheduleJob("Premium", "0 0 6 * * *", () => {
            this.premiumRenewJob()
        })
    }

    private async premiumRenewJob() {
        logger.info("======>> Premium cron started")
        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)
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
                    premiumType: { $ne: EPremiumType.LIFETIME },
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