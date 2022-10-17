import { HttpException } from "@/exceptions/HttpException";
import { ECommentStatus } from "@/interfaces/income.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/users.interface";
import incomeModel from "@/models/income.model";

class IncomeService {

    public async addComment(userId: string, actualUser: IUser, incomeId: string, message: string): Promise<void> {
        const updatedIncome = await incomeModel.findOneAndUpdate(
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
        if (!updatedIncome)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.INCOME_NOT_FOUND)
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
