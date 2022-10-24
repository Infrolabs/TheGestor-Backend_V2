import { SECRET_KEY } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { IAdmin } from "@/interfaces/admin.interface";
import { AdminDataStoredInToken, DataStoredInToken } from "@/interfaces/auth.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import adminModel from "@/models/admin.model";
import { filterAdmin } from "@/utils/filters";
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

    public createToken(user: IAdmin): string {
        const dataStoredInToken: AdminDataStoredInToken = { admin: { id: user._id } }
        const secretKey: string = SECRET_KEY;

        return sign(dataStoredInToken, secretKey);
    }
}

export default AdminService;
