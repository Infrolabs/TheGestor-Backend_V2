import { secretKey, CURRENCIES, TRANSACTION_TYPES, getResponseParameters } from 'redsys-pay'
import soap from 'soap'
import crypto from 'crypto'
import { Buffer } from 'buffer'
import xml from 'xml'
import { REDSYS_ERROR_URL, REDSYS_MERCHANT_CODE, REDSYS_MERCHANT_NAME, REDSYS_MERCHANT_TERMINAL, REDSYS_MERCHANT_URL, REDSYS_SECRET_KEY, REDSYS_SOAP_URL, REDSYS_SUCCESS_URL, REDSYS_URL } from '@/config'
import { EBillingPaymentStatus, EPlanType, ESubscriptionStatus, IBilling } from '@/interfaces/billing.interface'
import { BillinPlans } from '@/interfaces/plan.interface'
import { EPremiumType } from '@/interfaces/premium.interface'
import userModel from '@/models/users.model'
import billingModel from '@/models/billing.model'
import { logger } from '@/utils/logger'
class RedsysService {
    constructor() {
        secretKey(REDSYS_SECRET_KEY)
    }

    public getMerchantParams(orderNo: string, amount: number, userId: string, isRecurring: boolean = false): any {
        const obj = {
            amount: Math.round(amount * 100),
            order: orderNo,
            merchantName: REDSYS_MERCHANT_NAME,
            merchantCode: REDSYS_MERCHANT_CODE,
            currency: CURRENCIES.EUR,
            transactionType: TRANSACTION_TYPES.AUTHORIZATION,
            terminal: REDSYS_MERCHANT_TERMINAL,
            merchantURL: REDSYS_MERCHANT_URL,
            successURL: REDSYS_SUCCESS_URL,
            errorURL: REDSYS_ERROR_URL,
            productDesc: "User : " + userId,
            identifier: isRecurring ? "REQUIRED" : null,
            cofIni: isRecurring ? "S" : null,
            cofType: isRecurring ? "R" : null
        }


        const result = this.makeParameters(obj)

        return { url: REDSYS_URL, ...result }
    }

    public async renewPremium(billing: IBilling): Promise<void> {
        const identifier = billing?.transactionDetails?.Ds_MerchantParameters ? getResponseParameters(billing.transactionDetails.Ds_MerchantParameters)?.Ds_Merchant_Identifier : null
        const txnId = billing?.transactionDetails?.Ds_MerchantParameters ? getResponseParameters(billing.transactionDetails.Ds_MerchantParameters)?.Ds_Merchant_Cof_Txnid : null
        const plan = BillinPlans.find(plan => plan.id === billing.planId)
        if (!identifier || !txnId || billing.subscriptionStatus === ESubscriptionStatus.CANCELED || !plan || billing.paymentStatus === EBillingPaymentStatus.UNPAID) {
            await userModel.updateOne({ _id: billing.user }, { $set: { premiumType: EPremiumType.FREE } })
            return
        }

        let newBilling = new billingModel()
        newBilling.name = billing.name
        newBilling.cifNif = billing.cifNif
        newBilling.email = billing.email
        newBilling.province = billing.province
        newBilling.address = billing.address
        newBilling.country = billing.country
        newBilling.zipCode = billing.zipCode
        newBilling.city = billing.city
        newBilling.planId = billing.planId
        newBilling.planType = billing.planType
        newBilling.amount = billing.planType === EPlanType.YEARLY ? plan.amount.year : plan.amount.month
        newBilling.units = billing.units
        newBilling.user = billing.user
        newBilling.transactionDetails = billing.transactionDetails
        const orderNo = (await billingModel.countDocuments()) + 1
        newBilling.orderNo = String(orderNo % 10000).padStart(6, '0') + String(newBilling.user).substring(String(newBilling.user).length - 6)
        const today = new Date()
        if (newBilling.planType === EPlanType.MONTHLY) {
            newBilling.expiryDate = new Date(today.setMonth(today.getMonth() + newBilling.units))
        } else if (newBilling.planType === EPlanType.YEARLY) {
            newBilling.expiryDate = new Date(today.getFullYear() + newBilling.units, today.getMonth(), today.getDate())
        }
        newBilling = await newBilling.save()

        const dataparams = {
            amount: Math.round(newBilling.amount * 100),
            order: newBilling.orderNo,
            merchantCode: REDSYS_MERCHANT_CODE,
            currency: CURRENCIES.EUR,
            transactionType: TRANSACTION_TYPES.AUTHORIZATION,
            terminal: REDSYS_MERCHANT_TERMINAL,
            identifier: identifier,
            directPayment: true,
            cofTxnId: txnId,
            cofIni: "N",
            excepSca: "MIT",
            productDesc: "User : " + billing.user + " (Recurring)",
        }

        const params = this.makeWSParameters(dataparams)

        soap.createClient(REDSYS_SOAP_URL, (err, client) => {
            if (err) {
                userModel.updateOne({ _id: billing.user }, { $set: { premiumType: EPremiumType.FREE }})
            } else {
                client.trataPeticion({ _xml: params }, async (err2, result, rawResponse) => {
                    const start = new Date()
                    start.setMonth(0, 1)
                    start.setHours(0, 0, 0, 0)
                    const end = new Date()
                    end.setMonth(11, 32)
                    end.setHours(0, 0, 0, 0)
                    const invoices = await billingModel.countDocuments({ createdAt: { $gte: start, $lt: end }, paymentStatus: { $in: [EBillingPaymentStatus.PAID, EBillingPaymentStatus.UNPAID] } })
                    const invoiceNo = (new Date()).getFullYear() + "-INC-" + (String(invoices).padStart(6, "0"))
                    if (err2) {
                        await userModel.updateOne({ _id: billing.user }, { $set: { premiumType: EPremiumType.FREE, lastBilling: newBilling._id } })
                        await billingModel.updateOne({ _id: newBilling._id }, { $set: { invoiceNo, paymentStatus: EBillingPaymentStatus.UNPAID } })
                    } else {
                        await billingModel.updateOne({ _id: newBilling._id }, { $set: { invoiceNo, paymentStatus: EBillingPaymentStatus.PAID } })
                        await userModel.updateOne({ _id: billing.user }, { $set: { lastBilling: newBilling._id } })
                    }
                })
            }
        })
    }

    public validatePayment(merchantParams: any, amount: number): boolean {
        try {
            const result = getResponseParameters(merchantParams)
            if (result?.Ds_AuthorisationCode && Number(result?.Ds_Amount) === amount * 100)
                return true
        } catch (e) {
            logger.error("Payment validate error : ", e)
        }
        return false
    }

    private makeParameters(params: any): any {
        const paramsObj = this.inputValidate(params)
        const payload = JSON.stringify(paramsObj)
        const payloadBuffer = Buffer.from(payload)
        const Ds_MerchantParameters = payloadBuffer.toString('base64')
        const Ds_Signature = this.sha256Sign(REDSYS_SECRET_KEY, params.order, Ds_MerchantParameters)
        return { Ds_SignatureVersion: "HMAC_SHA256_V1", Ds_MerchantParameters, Ds_Signature }
    }

    private makeWSParameters(params: any): any {
        const paramsObj = this.inputValidate(params)
        const paramsData = Object.keys(paramsObj).map((x) => {
            const d = {}
            d[x] = paramsObj[x]
            return d
        })
        const datosEntrada = { DATOSENTRADA: paramsData }
        const payload: any = xml(datosEntrada)
        const Ds_MerchantParameters = payload.toString('base64')
        const Ds_Signature = this.sha256Sign(REDSYS_SECRET_KEY, params.order, Ds_MerchantParameters)
        const data = {
            REQUEST: [
                datosEntrada,
                { DS_SIGNATUREVERSION: "HMAC_SHA256_V1" },
                { DS_SIGNATURE: Ds_Signature }
            ]
        }
        return `<trataPeticion><datoEntrada><![CDATA[${xml(data)}]]></datoEntrada></trataPeticion>`
    }

    private sha256Sign(merchantKey: string, order: any, params: any) {
        const derivateKey = this.encryptOrder(merchantKey, order)
        const bufferDerivate = Buffer.from(derivateKey, 'base64')
        const hexMac256 = crypto.createHmac('sha256', bufferDerivate)
            .update(params)
            .digest('hex')
        const signature = Buffer.from(hexMac256, 'hex').toString('base64')
        return signature
    }

    private inputValidate(params: any): any {
        if (!params.merchantCode) throw new Error("The merchant code is mandatory")
        if (!params.transactionType) throw new Error("The transaction type is mandatory")
        if (!params.order) throw new Error("Warning: no order reference provided.")
        if (!params.terminal) params.terminal = 1
        if (!params.currency) params.currency = CURRENCIES.EUR

        const paramsObj: any = {
            DS_MERCHANT_AMOUNT: String(params.amount),
            DS_MERCHANT_ORDER: params.order,
            DS_MERCHANT_MERCHANTCODE: params.merchantCode,
            DS_MERCHANT_CURRENCY: params.currency,
            DS_MERCHANT_TRANSACTIONTYPE: params.transactionType,
            DS_MERCHANT_TERMINAL: params.terminal
        }
        if (params.merchantName) paramsObj.DS_MERCHANT_MERCHANTNAME = params.merchantName
        if (params.merchantPayMethods) paramsObj.DS_MERCHANT_PAYMETHODS = params.merchantPayMethods
        if (params.merchantURL) paramsObj.DS_MERCHANT_MERCHANTURL = params.merchantURL
        if (params.merchantSignature) paramsObj.DS_MERCHANT_MERCHANTSIGNATURE = params.merchantSignature
        if (params.errorURL) paramsObj.DS_MERCHANT_URLKO = params.errorURL
        if (params.successURL) paramsObj.DS_MERCHANT_URLOK = params.successURL
        if (params.dateFrecuency) paramsObj.DS_MERCHANT_DATEFRECUENCY = params.dateFrecuency
        if (params.chargeExpiryDate) paramsObj.DS_MERCHANT_CHARGEEXPIRYDATE = params.chargeExpiryDate
        if (params.sumTotal) paramsObj.DS_MERCHANT_SUMTOTAL = params.sumTotal
        if (params.directPayment) paramsObj.DS_MERCHANT_DIRECTPAYMENT = params.directPayment
        if (params.identifier) paramsObj.DS_MERCHANT_IDENTIFIER = params.identifier
        if (params.group) paramsObj.DS_MERCHANT_GROUP = params.group
        if (params.pan) paramsObj.DS_MERCHANT_PAN = params.pan
        if (params.expiryDate) paramsObj.DS_MERCHANT_EXPIRYDATE = params.expiryDate
        if (params.CVV2) paramsObj.DS_MERCHANT_CVV2 = params.CVV2
        if (params.cardCountry) paramsObj.DS_CARD_COUNTRY = params.cardCountry
        if (params.merchantData) paramsObj.DS_MERCHANT_MERCHANTDATA = params.merchantData
        if (params.clientIp) paramsObj.DS_MERCHANT_CLIENTIP = params.data
        if (params.lang) paramsObj.DS_MERCHANT_CONSUMERLANGUAGE = params.lang
        if (params.cofTxnId) paramsObj.DS_MERCHANT_COF_TXNID = params.cofTxnId
        if (params.cofIni) paramsObj.DS_MERCHANT_COF_INI = params.cofIni
        if (params.cofType) paramsObj.DS_MERCHANT_COF_TYPE = params.cofType
        if (params.excepSca) paramsObj.DS_MERCHANT_EXCEP_SCA = params.excepSca
        if (params.productDesc) paramsObj.DS_MERCHANT_PRODUCTDESCRIPTION = params.productDesc
        return paramsObj
    }

    private zeroPad(buf: any, blocksize: any): any {
        buf = Buffer.from(buf.toString(), 'utf8')
        var pad = Buffer.alloc((blocksize - (buf.length % blocksize)) % blocksize)
        pad.fill(0)
        return Buffer.concat([buf, pad])
    }

    private encryptOrder(merchantKey: any, orderRef: any): any {
        const secretKey = Buffer.from(merchantKey, 'base64')
        const iv = Buffer.alloc(8)
        iv.fill(0)
        const cipher = crypto.createCipheriv('des-ede3-cbc', secretKey, iv)
        cipher.setAutoPadding(false)
        const zerores = this.zeroPad(orderRef, 8)
        const res = cipher.update(zerores, 'utf8', 'base64') + cipher.final('base64')
        return res
    }
}

export default RedsysService