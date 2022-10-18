import { HttpException } from "@/exceptions/HttpException";
import { IExpense } from "@/interfaces/expense.interface";
import { ECommentStatus } from "@/interfaces/income.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/users.interface";
import expenseModel from "@/models/expense.model";

class ExpenseService {

    public async addComment(userId: string, actualUser: IUser, incomeId: string, message: string): Promise<IExpense> {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: incomeId, createdBy: userId, isDeleted: false },
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
