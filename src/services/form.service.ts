import { API_BASE_URL, SECRET_KEY } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { EAccessStatus, EAccessType } from "@/interfaces/access.interface";
import { DataStoredInToken } from "@/interfaces/auth.interface";
import { EClientType } from "@/interfaces/client.interface";
import { AVAILABLE_FORMS, IForm, ITaxForm } from "@/interfaces/form.interface";
import { EVatType } from "@/interfaces/invoice.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { ETaxStatus, ETaxType, ITax } from "@/interfaces/tax.interface";
import { IUser } from "@/interfaces/users.interface";
import accessModel from "@/models/access.model";
import clientModel from "@/models/client.model";
import expenseModel from "@/models/expense.model";
import incomeModel from "@/models/income.model";
import taxModel from "@/models/tax.model";
import userModel from "@/models/users.model";
import { getFormDueDate, getNameAndSurname, getTrimesterEndDate, getTrimesterStartDate, getVatFromBase } from "@/utils/util";
import { verify } from 'jsonwebtoken';

class FormService {

    public async getFormList(user: IUser, year: number, trimester: number): Promise<ITaxForm[]> {
        const taxData = await taxModel.find({ userId: user._id, year, trimester })
        const result: ITaxForm[] = []
        AVAILABLE_FORMS.forEach(form => {
            const taxIndex = taxData.findIndex(tax => tax.type === form._id)
            result.push({
                type: form._id as ETaxType,
                data: taxIndex !== -1 ? taxData[taxIndex].data : null,
                status: taxIndex !== -1 ? taxData[taxIndex].status : ETaxStatus.PENDING,
                year,
                trimester,
                formDetails: {
                    _id: form._id,
                    name: Object.keys(form).includes(user.language) ? form[user.language].name : form.en.name,
                    type: Object.keys(form).includes(user.language) ? form[user.language].type : form.en.type,
                    dueDate: getFormDueDate(trimester, year)
                }
            })
        })
        return result
    }

    public async getFormData(authToken: string, user: IUser, type: ETaxType, year: number, trimester: number): Promise<IForm> {
        const taxData = await taxModel.findOne({ userId: user._id, type, year, trimester })
        if (taxData && taxData.data)
            return {
                authToken,
                userId: user._id,
                postUrl: API_BASE_URL + "/form/",
                imageBaseUrl: API_BASE_URL + "/static/img",
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
        const defaultFormData = await this.getDefaultFormData(user._id, type, trimester, year)
        return {
            authToken,
            userId: user._id,
            postUrl: API_BASE_URL + "/form/",
            imageBaseUrl: API_BASE_URL + "/static/img",
            cssUrl: API_BASE_URL + "/static/css/" + type + ".css",
            jsUrl: API_BASE_URL + "/static/js/" + type + ".js",
            formType: type,
            year,
            trimester,
            cifNif: user.cifNif,
            name: getNameAndSurname(user.name).name,
            surname: getNameAndSurname(user.name).surname,
            data: defaultFormData
        }
    }

    public async saveFormData(data: any): Promise<void> {
        const userToken = await this.validateAuthToken(data.authToken)
        const user = await this.validateEditAuthority(userToken, data.userId)
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

    private async validateEditAuthority(authUser: IUser, userId: string): Promise<IUser> {
        let user = await userModel.findById(authUser._id)
        if (String(user._id) === String(userId))
            return user
        const access = await accessModel.findOne({ user: userId, email: user.email, status: EAccessStatus.ACCEPTED, accessType: { $in: [EAccessType.ADMIN, EAccessType.EDIT] } }).populate('user').lean()
        return (access?.user as IUser) || user
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
            expenses.forEach(exp => {
                if (exp.manualItem && exp.manualItem.length > 0) {
                    exp.manualItem.forEach(item => {
                        if (item.irpf !== 1 && item.irpf !== 2 && item.irpf !== 7 && item.irpf !== 15)
                            return

                        totalBaseExp += item.cost * item.unit
                        totalIrpf += item.cost * item.unit * item.irpf / 100
                    })
                } else if (exp.items && exp.items.length > 0) {
                    exp.items.forEach(item => {
                        if (item.irpf !== 1 && item.irpf !== 2 && item.irpf !== 7 && item.irpf !== 15)
                            return

                        totalBaseExp += item.cost * item.selectedQuantity
                        totalIrpf += item.cost * item.selectedQuantity * item.irpf / 100
                    })
                }
            })
            dataArray[8] = totalBaseExp
            dataArray[9] = totalIrpf
            const data = Object.fromEntries(dataArray.map((element, index) => [String(index), element]))
            delete data['0']
            return data
        } else if (type === ETaxType.FORM130) {
            let dataArray = new Array(20).fill("")
            const cumulativeStart = new Date()
            cumulativeStart.setFullYear(cumulativeStart.getFullYear(), 0, 1)
            cumulativeStart.setHours(0, 0, 0, 0)
            const cumulativeIncomes = await incomeModel.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        isDeleted: false,
                        invoiceDate: { $gte: cumulativeStart, $lt: getTrimesterEndDate(trimester, year) },
                        isDraft: false
                    }
                },
                {
                    $project: {
                        totalDouble: { $ifNull: [{ $convert: { input: "$subTotal", to: "double", onError: 0 } }, 0] },
                        totalTriDouble: { $cond: { if: { invoiceDate: { $gte: getTrimesterStartDate(trimester, year), $lt: getTrimesterEndDate(trimester, year) } }, then: [{ $convert: { input: "$subTotal", to: "double", onError: 0 } }, 0], else: 0 } },
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalIncome: { $sum: '$totalDouble' },
                        totalTriIncome: { $sum: '$totalTriDouble' }
                    }
                }
            ])
            dataArray[0] = cumulativeIncomes[0]?.totalIncome || 0
            const expenses = await expenseModel.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        isDeleted: false,
                        invoiceDate: { $gte: getTrimesterStartDate(trimester, year), $lt: getTrimesterEndDate(trimester, year) },
                        isDraft: false
                    }
                },
                {
                    $project: {
                        totalDouble: { $ifNull: [{ $convert: { input: "$subTotal", to: "double", onError: 0 } }, 0] },
                        vatDouble: { $ifNull: [{ $convert: { input: "$vat", to: "double", onError: 0 } }, 0] },
                        irpfDouble: { $ifNull: [{ $convert: { input: "$irpf", to: "double", onError: 0 } }, 0] },
                        retentionProvidersDouble: { $ifNull: [{ $convert: { input: "$retentionProviders", to: "double", onError: 0 } }, 0] },
                        retentionRentDouble: { $ifNull: [{ $convert: { input: "$retentionRent", to: "double", onError: 0 } }, 0] },
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalExpense: { $sum: '$totalDouble' },
                        totalVat: { $sum: "$vatDouble" },
                        totalIRPF: { $sum: "$irpfDouble" },
                        totalRetentionProviders: { $sum: "$retentionProvidersDouble" },
                        totalRetentionRent: { $sum: "$retentionRentDouble" },
                    }
                }
            ])
            let cell2Total = 0
            let cell5 = 0
            const taxes = await taxModel.find({ userId: userId, year, trimester: { $lt: trimester }, type: ETaxType.FORM130 })
            taxes.forEach(tax => {
                if (tax.data && Object.keys(tax.data).length > 15) {
                    cell2Total += Number(tax.data[1]) || 0
                    if ((Number(tax.data[7]) || 0) > 0 && tax.trimester === trimester - 1) {
                        cell5 = Number(tax.data[7]) - (Number(tax.data[15]) || 0)
                    }
                }
            })


            const totalIncome = cumulativeIncomes[0]?.totalTriDouble || 0
            const totalExpense = (expenses[0]?.totalExpense || 0)
            dataArray[1] = ((totalIncome - totalExpense) * 5 / 100) + totalIncome + cell2Total
            dataArray[4] = cell5
            const data = Object.fromEntries(dataArray.map((element, index) => [String(index), element]))
            data.isSimplified = "true"
            data.simplifiedExtraValue = ((totalIncome - totalExpense) * 5 / 100)
            return data
        } else if (type === ETaxType.FORM303) {
            let dataArray = new Array(168).fill(null)
            const findCondition = {
                createdBy: userId,
                isDeleted: false,
                invoiceDate: { $gte: getTrimesterStartDate(trimester, year), $lt: getTrimesterEndDate(trimester, year) }
            }
            const incomes = await incomeModel.find(findCondition)
            let vat4Base = 0
            let vat10Base = 0
            let vat21Base = 0
            incomes.forEach(income => {
                if (income.manualItem && income.manualItem.length > 0) {
                    income.manualItem.forEach(item => {
                        if (item.vatType === EVatType.STANDARD_21)
                            vat21Base += Number(item.unit) * Number(item.cost)
                        if (item.vatType === EVatType.REDUCED_10)
                            vat10Base += Number(item.unit) * Number(item.cost)
                        if (item.vatType === EVatType.SUPER_REDUCED_4)
                            vat4Base += Number(item.unit) * Number(item.cost)
                    })
                } else if (income.items && income.items.length > 0) {
                    income.items.forEach(item => {
                        if (item.vatType === EVatType.STANDARD_21)
                            vat21Base += Number(item.selectedQuantity) * Number(item.cost)
                        if (item.vatType === EVatType.REDUCED_10)
                            vat10Base += Number(item.selectedQuantity) * Number(item.cost)
                        if (item.vatType === EVatType.SUPER_REDUCED_4)
                            vat4Base += Number(item.selectedQuantity) * Number(item.cost)
                    })
                }
            })
            const expenses = await expenseModel.find({ ...findCondition, isSimplified: { $ne: true } })
            let intracommunityExp = 0
            let baseExp = 0
            let vatExp = 0
            expenses.forEach(exp => {
                if (exp.manualItem && exp.manualItem.length > 0) {
                    exp.manualItem.forEach(item => {
                        if (item.vatType === EVatType.INTRA_COM_0)
                            intracommunityExp += Number(item.unit) * Number(item.cost)
                        else if (item.vatType !== EVatType.WITHOUT_0) {
                            baseExp += Number(item.unit) * Number(item.cost)
                            vatExp += getVatFromBase(Number(item.unit) * Number(item.cost), item.vatType)
                        }
                    })
                } else if (exp.items && exp.items.length > 0) {
                    exp.items.forEach(item => {
                        if (item.vatType === EVatType.INTRA_COM_0)
                            intracommunityExp += Number(item.selectedQuantity) * Number(item.cost)
                        else if (item.vatType === EVatType.WITHOUT_0) {
                            baseExp += Number(item.selectedQuantity) * Number(item.cost)
                            vatExp += getVatFromBase(Number(item.selectedQuantity) * Number(item.cost), item.vatType)
                        }
                    })
                }
            })

            dataArray[14] = vat4Base
            dataArray[15] = 4
            dataArray[17] = vat10Base
            dataArray[18] = 10
            dataArray[20] = vat21Base
            dataArray[21] = 21
            dataArray[41] = baseExp
            dataArray[42] = vatExp
            dataArray[49] = intracommunityExp
            dataArray[50] = intracommunityExp * 21 / 100
            const data = Object.fromEntries(dataArray.map((element, index) => [String(index), element]))
            return data
        }
        return {}
    }


}

export default FormService;
