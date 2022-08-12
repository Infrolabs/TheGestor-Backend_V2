import { IUserRequest } from "@/interfaces/auth.interface"
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface"
import { NextFunction } from "express"

const responseMiddleware = (req: IUserRequest, res: any, next: NextFunction) => {
    res.success = (message: string, data: any = null) => {
        // Response message localization
        const respMessage = message && req.user &&
            Object.values(ResponseMessages.en).some(v => v === message) &&
            ResponseMessages[req.user.language]
            ?
            ResponseMessages[req.user.language][Object.keys(ResponseMessages.en).find(key => ResponseMessages.en[key] === message)]
            :
            message
        const response = {
            code: ResponseCodes.SUCCESS,
            message: respMessage,
            data
        }
        return res.status(ResponseCodes.SUCCESS).json(response)
    }
    next()
}

export default responseMiddleware