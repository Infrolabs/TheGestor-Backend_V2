import { API_BASE_URL, SECRET_KEY } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { DataStoredInToken } from "@/interfaces/auth.interface";
import { EClientType } from "@/interfaces/client.interface";
import { IForm } from "@/interfaces/form.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { ETaxStatus, ETaxType, ITax } from "@/interfaces/tax.interface";
import { IUser } from "@/interfaces/users.interface";
import clientModel from "@/models/client.model";
import expenseModel from "@/models/expense.model";
import taxModel from "@/models/tax.model";
import userModel from "@/models/users.model";
import { logger } from "@/utils/logger";
import { getNameAndSurname, getTrimesterEndDate, getTrimesterStartDate } from "@/utils/util";
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
                jsUrl: API_BASE_URL + "/static/js/" + type + ".js",
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
            jsUrl: API_BASE_URL + "/static/js/" + type + ".js",
            formType: type,
            year,
            trimester,
            cifNif: user.cifNif,
            name: getNameAndSurname(user.name).name,
            surname: getNameAndSurname(user.name).surname,
            data: this.getDefaultFormData(user._id, type, year, trimester)
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

    private async getDefaultFormData(userId: string, type: ETaxType, trimester: number, year: number): Promise<any> {
        if (type === ETaxType.FORM111) {
            let dataArray = new Array(31).fill(null)
            const noOfSuppliers = await clientModel.countDocuments({ createdBy: userId, clientType: EClientType.SUPPLIER, isDeleted: false })
            dataArray[7] = noOfSuppliers
            const expenses = await expenseModel.find({
                invoiceDate: { $gte: getTrimesterStartDate(trimester, year), $lte: getTrimesterEndDate(trimester, year) },
                createdBy: userId,
                isDeleted: false,
                isDraft: false
            }, { manualItem: 1, items: 1 })
            let totalBaseExp = 0
            let totalIrpf = 0
            expenses.forEach(exp=>{
                if(exp.manualItem && exp.manualItem.length > 0){
                    exp.manualItem.forEach(item=>{
                        if(item.irpf !== 1 && item.irpf !== 2 && item.irpf !== 7 && item.irpf !== 15)
                        return

                        totalBaseExp += item.cost * item.unit
                        totalIrpf += item.cost * item.unit * item.irpf / 100
                    })
                }else if(exp.items && exp.items.length > 0){
                    exp.items.forEach(item=>{
                        if(item.irpf !== 1 && item.irpf !== 2 && item.irpf !== 7 && item.irpf !== 15)
                        return

                        totalBaseExp += item.cost * item.selectedQuantity
                        totalIrpf += item.cost * item.selectedQuantity * item.irpf / 100
                    })
                }
            })

            const data = Object.fromEntries(dataArray.map((element, index) => [String(index), element]))
            delete data['0']
            return data
        }
        return {}
    }


}

export default FormService;
