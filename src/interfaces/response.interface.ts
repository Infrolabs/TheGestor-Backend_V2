export enum ResponseCodes {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export enum ResponseMessages {
    EMAIL_EXISTS = 'Email already exists',
    PHONE_EXISTS = 'Phone number already exists',
    OTP_SENT = 'OTP sent to your phone',
    OTP_EXPIRED = 'OTP has been expired',
    OTP_INCORRECT = 'OTP entered is incorrect',
    SIGNUP_SUCCESS = "User signup successfully"
}