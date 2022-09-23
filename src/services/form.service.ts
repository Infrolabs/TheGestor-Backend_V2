import { API_BASE_URL, SECRET_KEY } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { DataStoredInToken } from "@/interfaces/auth.interface";
import { IForm } from "@/interfaces/form.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { ETaxStatus, ETaxType, ITax } from "@/interfaces/tax.interface";
import { IUser } from "@/interfaces/users.interface";
import taxModel from "@/models/tax.model";
import userModel from "@/models/users.model";
import { logger } from "@/utils/logger";
import { getNameAndSurname } from "@/utils/util";
import { verify } from 'jsonwebtoken';

class FormService {
    public async getFormData(authToken: string, user: IUser, type: ETaxType, year: number, trimester: number): Promise<IForm> {
        const taxData = await taxModel.findOne({ userId: user._id, type, year, trimester })
        if (taxData)
            return {
                authToken,
                postUrl: API_BASE_URL + "/form/",
                modelBackgroundImage: API_BASE_URL + "/static/img/" + type + ".jpeg",
                cssUrl: API_BASE_URL + "/static/css/" + type + ".css",
                currencyformaterUrl: API_BASE_URL + "/static/js/jquery.formatCurrency.js",
                formType: type,
                year,
                trimester,
                cifNif: user.cifNif,
                name: getNameAndSurname(user.name).name,
                surname: getNameAndSurname(user.name).surname,
                data: taxData.data
            }
        // Set form with default data
        return {
            authToken,
            postUrl: API_BASE_URL + "/form/",
            modelBackgroundImage: API_BASE_URL + "/static/img/" + type + ".jpeg",
            cssUrl: API_BASE_URL + "/static/css/" + type + ".css",
            currencyformaterUrl: API_BASE_URL + "/static/js/jquery.formatCurrency.js",
            formType: type,
            year,
            trimester,
            cifNif: user.cifNif,
            name: getNameAndSurname(user.name).name,
            surname: getNameAndSurname(user.name).surname,
            data: {}
        }
    }

    public async saveFormData(data: any): Promise<void> {
        const user = await this.validateAuthToken(data.authToken)
        const formType = String(data.type)
        const year = Number(data.year)
        const trimester = Number(data.trimester)
        const name = String(data.name)
        const cifNif = String(data.cifNif)
        delete data.authToken
        delete data.type
        delete data.year
        delete data.trimester
        delete data.name
        delete data.cifNif

        await taxModel.findOneAndUpdate({ type: formType, year, trimester, userId: user._id }, { name, cifNif, data }, { upsert: true, new: true })
    }

    private async validateAuthToken(authToken: string): Promise<IUser> {
        const verificationResponse = (verify(authToken, SECRET_KEY)) as DataStoredInToken;
        const userId = verificationResponse.user.id;
        const user = await userModel.findById(userId);
        if (!user)
            throw new HttpException(ResponseCodes.UNAUTHORIZED, ResponseMessages.en.WRONG_AUTH_TOKEN)
        return user
    }


}

export default FormService;
