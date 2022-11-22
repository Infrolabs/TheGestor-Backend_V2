import { HttpException } from "@/exceptions/HttpException";
import { ECommentStatus, IIncome } from "@/interfaces/income.interface";
import { ENotificationDataType, ENotificationType } from "@/interfaces/notification.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { ELanguage, IUser } from "@/interfaces/users.interface";
import incomeModel from "@/models/income.model";
import userModel from "@/models/users.model";
import EmailService from "./email.service";
import NotificationService from "./notification.service";

class IncomeService {
    private notificationService = new NotificationService()
    private emailService = new EmailService()

    public async addComment(user: IUser, actualUser: IUser, incomeId: string, message: string): Promise<IIncome> {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: incomeId, createdBy: user._id, isDeleted: false },
            {
                $addToSet: {
                    comments: {
                        userId: actualUser._id,
                        name: actualUser.companyName || actualUser.name,
                        message,
                        sentAt: new Date()
                    }
                },
                $set: {
                    commentStatus: ECommentStatus.UNREAD
                }
            },
            { new: true }
        )
        if (!updatedIncome)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.INCOME_NOT_FOUND)
        let users: IUser[] = []
        if (String(actualUser._id) !== String(user._id))
            users.push(user)
        else {
            const usersToNotify: String[] = []
            updatedIncome.comments?.forEach(comment => {
                if (String(comment.userId) !== String(actualUser._id) && !usersToNotify.includes(String(comment.userId)))
                    usersToNotify.push(String(comment.userId))
            })
            users = await userModel.find({ _id: { $in: usersToNotify } })
        }
        for (let i = 0; i < users.length; i++) {
            this.notificationService.sendNotification(
                {
                    [ELanguage.EN]: `${actualUser.companyName || actualUser.name} has commented on ${updatedIncome.invoiceNo}. Please reply as soon as possible.`,
                    [ELanguage.ES]: `${actualUser.companyName || actualUser.name} ha añadido un comentario para ${updatedIncome.invoiceNo}. Por favor, compruebe y responda lo antes posible.`,
                },
                ENotificationType.COMMENT,
                [users[i]._id],
                { url: actualUser.image, type: ENotificationDataType.INCOME, resourceId: incomeId }
            )
            this.emailService.sendCommentMail(users[i].companyName || users[i].name, actualUser.companyName || actualUser.name, updatedIncome.invoiceNo, users[i].email)
        }

        return updatedIncome
    }

    public async changeCommentStatus(userId: string, incomeId: string, status: ECommentStatus): Promise<void> {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: incomeId, createdBy: userId, isDeleted: false },
            { $set: { commentStatus: status } },
            { new: true }
        )
        if (!updatedIncome)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.INCOME_NOT_FOUND)
    }




}

export default IncomeService;
