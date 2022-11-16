import { ONESIGNAL_APP_ID, ONESIGNAL_API_KEY } from "@/config";
import { ENotificationType, INotification, INotificationLocalizedMessages } from "@/interfaces/notification.interface";
import { ELanguage } from "@/interfaces/users.interface";
import notificationModel from "@/models/notification.model";
import userModel from "@/models/users.model";
import OneSignal from 'onesignal-node'

class NotificationService {
    private oneSignalClient = new OneSignal.Client(ONESIGNAL_APP_ID, ONESIGNAL_API_KEY)
    
    public async sendNotification(message: INotificationLocalizedMessages, type: ENotificationType, userIds: string[]): Promise<void> {
        const notificationUsers = {
            [ELanguage.EN]: [],
            [ELanguage.ES]: [],
        }

        const users = await userModel.find({ _id: { $in: userIds } }, { _id: 1, language: 1 }).lean()
        notificationUsers[ELanguage.EN] = users.filter(u => u.language === ELanguage.EN).map(u => u._id)
        notificationUsers[ELanguage.ES] = users.filter(u => u.language === ELanguage.ES).map(u => u._id)
        if (notificationUsers[ELanguage.EN].length > 0) {
            this.oneSignalClient.createNotification({
                contents: {
                    'en': message[ELanguage.EN],
                },
                include_external_user_ids: notificationUsers[ELanguage.EN]
            })
        }
        if (notificationUsers[ELanguage.ES].length > 0) {
            this.oneSignalClient.createNotification({
                contents: {
                    'en': message[ELanguage.ES],
                },
                include_external_user_ids: notificationUsers[ELanguage.ES]
            })
        }

        const notifications: INotification[] = []
        notificationUsers[ELanguage.EN].forEach(userId => {
            notifications.push({
                message: message[ELanguage.EN],
                type,
                localizationMessages: message,
                userId
            })
        })
        notificationUsers[ELanguage.ES].forEach(userId => {
            notifications.push({
                message: message[ELanguage.ES],
                type,
                localizationMessages: message,
                userId
            })
        })
        await notificationModel.insertMany(notifications)
    }


}

export default NotificationService;
