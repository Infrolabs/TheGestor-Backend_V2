import { HttpException } from "@/exceptions/HttpException";
import { EAccessStatus, EAccessType } from "@/interfaces/access.interface";
import { IUserRequest } from "@/interfaces/auth.interface";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { IUser } from "@/interfaces/users.interface";
import accessModel from "@/models/access.model";
import { NextFunction, Response } from "express";

export const readAuthorityMiddleware = async (req: IUserRequest, res: Response, next: NextFunction) => {
    const accessUserId = req.header('x-access-user');
    if (!accessUserId) {
        next()
        return
    }

    const access = await accessModel.findOne({ user: accessUserId, email: req.user.email }).populate('user').lean()
    if (!access){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.NO_ACCESS_ERROR))
        return
    }
    if (access.status !== EAccessStatus.ACCEPTED){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.INVITE_NOT_ACCEPTED))
        return
    }
    req.actualUser = req.user
    req.user = access.user as IUser
    next()
}

export const editAuthorityMiddleware = async (req: IUserRequest, res: Response, next: NextFunction) => {
    const accessUserId = req.header('x-access-user');
    if (!accessUserId) {
        next()
        return
    }

    const access = await accessModel.findOne({ user: accessUserId, email: req.user.email }).populate('user').lean()
    if (!access){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.NO_ACCESS_ERROR))
        return
    }
    if (access.status !== EAccessStatus.ACCEPTED){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.INVITE_NOT_ACCEPTED))
        return
    }
    if (access.accessType === EAccessType.READ){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.EDIT_ACCESS_ERROR))
        return
    }
    req.actualUser = req.user
    req.user = access.user as IUser
    next()
}

export const adminAuthorityMiddleware = async (req: IUserRequest, res: Response, next: NextFunction) => {
    const accessUserId = req.header('x-access-user');
    if (!accessUserId) {
        next()
        return
    }

    const access = await accessModel.findOne({ user: accessUserId, email: req.user.email }).populate('user').lean()
    if (!access){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.NO_ACCESS_ERROR))
        return
    }
    if (access.status !== EAccessStatus.ACCEPTED){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.INVITE_NOT_ACCEPTED))
        return
    }
    if (access.accessType !== EAccessType.ADMIN){
        next(new HttpException(ResponseCodes.FORBIDDEN,ResponseMessages.en.ADMIN_ACCESS_ERROR))
        return
    }
    req.actualUser = req.user
    req.user = access.user as IUser
    next()
}