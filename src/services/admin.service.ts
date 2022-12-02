import { SECRET_KEY } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { IAdmin } from "@/interfaces/admin.interface";
import { AdminDataStoredInToken, DataStoredInToken } from "@/interfaces/auth.interface";
import { EBillingPaymentStatus, IBilling } from "@/interfaces/billing.interface";
import { EPremiumType } from "@/interfaces/premium.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/users.interface";
import adminModel from "@/models/admin.model";
import billingModel from "@/models/billing.model";
import userModel from "@/models/users.model";
import { filterAdmin, filterBillingProjection, filterUserProjection } from "@/utils/filters";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken';

class AdminService {

    public async login(adminData: IAdmin): Promise<{ token: string; admin: IAdmin }> {
        const user = await adminModel.findOne({ email: adminData.email }).lean();
        if (!user)
            throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.en.EMAIL_NOT_REGISTERED)

        const isMatch = await compare(adminData.password, user.password);
        if (!isMatch)
            throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.PASSWORD_INCORRECT)

        const token = this.createToken(user)
        return { token, admin: filterAdmin(user) };
    }

    public async usersList(search: string, premiumType: EPremiumType, skip: number, limit: number): Promise<{ users: IUser[], totalCount: number }> {
        let findCondition: any = {}
        if (search)
            findCondition = {
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { phoneNumber: { $regex: search, $options: 'i' } }
                ]
            }
        if (premiumType)
            findCondition = { ...findCondition, premiumType }
        const users = await userModel.find(findCondition, filterUserProjection).populate('lastBilling', filterBillingProjection).skip(skip).limit(limit).sort({ _id: -1 }).lean()
        const totalCount = await userModel.countDocuments(findCondition)
        return { users, totalCount };
    }

    public async billingList(paymentStatus: EBillingPaymentStatus, skip: number, limit: number): Promise<{ billings: IBilling[], totalCount: number }> {
        let findCondition: any = {}
        if (paymentStatus)
            findCondition = {
                paymentStatus
            }
        const billings = await billingModel.find(findCondition).skip(skip).limit(limit).sort({ _id: -1 }).lean()
        const totalCount = await billingModel.countDocuments(findCondition)
        return { billings, totalCount };
    }

    public createToken(user: IAdmin): string {
        const dataStoredInToken: AdminDataStoredInToken = { admin: { id: user._id } }
        const secretKey: string = SECRET_KEY;

        return sign(dataStoredInToken, secretKey);
    }
}

export default AdminService;
