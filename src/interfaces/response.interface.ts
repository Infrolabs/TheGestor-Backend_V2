import { Response } from "express";

export interface IApiResponse extends Response {
    success: (message: string, data?: any) => void
}

export enum ResponseCodes {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export const ResponseMessages = {
    en: {
        SOMETHING_WENT_WRONG: 'Something went wrong',
        WRONG_AUTH_TOKEN: 'Wrong authentication token',
        AUTH_TOKEN_MISSING: 'Authentication token missing',
        EMAIL_EXISTS: 'Email already exists',
        PHONE_EXISTS: 'Phone number already exists',
        OTP_SENT: 'OTP sent to your phone',
        OTP_EXPIRED: 'OTP has been expired',
        OTP_INCORRECT: 'OTP entered is incorrect',
        SIGNUP_SUCCESS: "User signup successfully",
        EMAIL_NOT_REGISTERED: "This email is not registered",
        PASSWORD_INCORRECT: "The password is incorrect",
        LOGIN_SUCCESS: "Login successfully",
        PLANS_FOUND: "Plans found",
        COUPON_NOT_FOUND: 'Coupon not found',
        COUPON_INVALID_PLAN: 'Coupon cannot be applied to selected plan',
        COUPON_CANNOT_REDEEM: 'Coupon cannot be redeemed by you',
        COUPON_USED: 'Coupon already used',
        COUPON_APPLIED_SUCCESS: 'Coupon applied successfully',
    },
    es: {
        SOMETHING_WENT_WRONG: 'Something went wrong',
        WRONG_AUTH_TOKEN: 'Wrong authentication token',
        AUTH_TOKEN_MISSING: 'Authentication token missing',
        EMAIL_EXISTS: 'Email already exists',
        PHONE_EXISTS: 'Phone number already exists',
        OTP_SENT: 'OTP sent to your phone',
        OTP_EXPIRED: 'OTP has been expired',
        OTP_INCORRECT: 'OTP entered is incorrect',
        SIGNUP_SUCCESS: "User signup successfully",
        EMAIL_NOT_REGISTERED: "This email is not registered",
        PASSWORD_INCORRECT: "The password is incorrect",
        LOGIN_SUCCESS: "Login successfully",
        PLANS_FOUND: "Plans found",
        COUPON_NOT_FOUND: 'Coupon not found',
        COUPON_INVALID_PLAN: 'Coupon cannot be applied to selected plan',
        COUPON_CANNOT_REDEEM: 'Coupon cannot be redeemed by you',
        COUPON_USED: 'Coupon already used',
        COUPON_APPLIED_SUCCESS: 'Coupon applied successfully',
    }
}