import { HttpException } from "@/exceptions/HttpException";
import { IExpense } from "@/interfaces/expense.interface";
import { ECommentStatus } from "@/interfaces/income.interface";
import { ENotificationDataType, ENotificationType } from "@/interfaces/notification.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { ELanguage, IUser } from "@/interfaces/users.interface";
import expenseModel from "@/models/expense.model";
import EmailService from "./email.service";
import NotificationService from "./notification.service";

class ExpenseService {
    private notificationService = new NotificationService()
    private emailService = new EmailService()

    public async addComment(user: IUser, actualUser: IUser, expenseId: string, message: string): Promise<IExpense> {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: expenseId, createdBy: user._id, isDeleted: false },
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
        if (!updatedExpense)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.INCOME_NOT_FOUND)
            
        this.notificationService.sendNotification(
            {
                [ELanguage.EN]: `${actualUser.companyName || actualUser.name} has commented on ${updatedExpense.invoiceNo}. Please reply as soon as possible.`,
                [ELanguage.ES]: `${actualUser.companyName || actualUser.name} ha añadido un comentario para ${updatedExpense.invoiceNo}. Por favor, compruebe y responda lo antes posible.`,
            },
            ENotificationType.COMMENT,
            [user._id],
            { url: actualUser.image, type: ENotificationDataType.EXPENSE, resourceId: expenseId }
        )
        this.emailService.sendCommentMail(user.companyName || user.name, actualUser.companyName || actualUser.name, updatedExpense.invoiceNo, user.email)
        return updatedExpense
    }

    public async changeCommentStatus(userId: string, incomeId: string, status: ECommentStatus): Promise<void> {
        const updatedIncome = await expenseModel.findOneAndUpdate(
            { _id: incomeId, createdBy: userId, isDeleted: false },
            { $set: { commentStatus: status } },
            { new: true }
        )
        if (!updatedIncome)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.INCOME_NOT_FOUND)
    }




}

export default ExpenseService;
