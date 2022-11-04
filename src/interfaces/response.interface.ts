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
        COUPON_CREATED: 'Coupon created successfully',
        PLAN_NOT_FOUND: 'Plan not found',
        INVALID_COUPON_UNITS: 'Coupon cannot be applied to the given units',
        INVALID_BILLING_AMOUNT: 'Invalid billing amount',
        BILLING_CREATED: 'Billing created successfully',
        UNPAID_BILL_ERROR: 'Please pay your unpaid bills to purchase the subscription',
        NO_ACCESS_ERROR: 'You dont have access to the account',
        INVITE_NOT_ACCEPTED: 'You have not accepted the invite yet',
        EDIT_ACCESS_ERROR: 'You dont have edit access to the account',
        ADMIN_ACCESS_ERROR: 'You dont have admin access to the account',
        BILLINGS_FOUND: 'Billings found',
        INVALID_PAYMENT: 'Payment is not valid. Please contact support.',
        SUBSCRIPTION_CANCELED: 'Subscription canceled successfully',
        BILL_NOT_FOUND: 'Bill not found',
        BILLING_UPDATED: 'Billing updated successfully',
        TAXES_FOUND: 'Taxes found',
        FORM_NOT_SUPPORTED: 'Form not supported currently',
        FORM_INVALID_DATA: 'It seems there is some error in form data',
        TAX_NOT_FOUND: 'Tax details not saved. Please save tax details first.',
        TAX_UPDATED: 'Tax details saved successfully',
        CONFIG_FETCHED: 'Config fetched successfully',
        COMMENT_ADDED: 'Comment added successfully',
        COMMENT_STATUS_CHANGED: 'Comment status changed successfully',
        INCOME_NOT_FOUND: 'Income not found',
        FORMS_FETCHED: 'Forms fetched successfully',
        USERS_FETCHED: 'Users fetched successfully',
    },
    es: {
        SOMETHING_WENT_WRONG: 'Algo salió mal',
        WRONG_AUTH_TOKEN: 'Ficha de autenticación incorrecta',
        AUTH_TOKEN_MISSING: 'Falta el token de autenticación',
        EMAIL_EXISTS: 'El correo electrónico ya existe',
        PHONE_EXISTS: 'El número de teléfono ya existe',
        OTP_SENT: 'OTP enviada a su teléfono',
        OTP_EXPIRED: 'La OTP ha expirado',
        OTP_INCORRECT: 'La OTP introducida es incorrecta',
        SIGNUP_SUCCESS: "El usuario se ha registrado con éxito",
        EMAIL_NOT_REGISTERED: "Este Email no está registrado",
        PASSWORD_INCORRECT: "La contraseña es incorrecta",
        LOGIN_SUCCESS: "Inicio de sesión con éxito",
        PLANS_FOUND: "Planes encontrados",
        COUPON_NOT_FOUND: "Cupón no encontrado",
        COUPON_INVALID_PLAN: "No se puede aplicar el cupón al plan seleccionado",
        COUPON_CANNOT_REDEEM: 'Cupón inválido',
        COUPON_USED: 'Cupón ya utilizado',
        COUPON_APPLIED_SUCCESS: 'Cupón aplicado con éxito',
        COUPON_CREATED: 'Cupón creado con éxito',
        PLAN_NOT_FOUND: 'Plan no encontrado',
        INVALID_COUPON_UNITS: 'No se puede aplicar el cupón a las unidades indicadas',
        INVALID_BILLING_AMOUNT: 'Importe de facturación no válido',
        BILLING_CREATED: 'Facturación creada con éxito',
        UNPAID_BILL_ERROR: 'Por favor, pague sus facturas pendientes para comprar la suscripción',
        NO_ACCESS_ERROR: 'No tiene acceso a la cuenta',
        INVITE_NOT_ACCEPTED: 'Todavía no has aceptado la invitación',
        EDIT_ACCESS_ERROR: 'No tienes acceso para editar la cuenta',
        ADMIN_ACCESS_ERROR: 'No tiene acceso de administrador a la cuenta',
        BILLINGS_FOUND: 'Facturas encontradas',
        INVALID_PAYMENT: 'El pago no es válido. Por favor, póngase en contacto con el servicio de atención al cliente',
        SUBSCRIPTION_CANCELED: 'Suscripción cancelada con éxito',
        BILL_NOT_FOUND: 'Factura no encontrada',
        BILLING_UPDATED: 'Facturación actualizada con éxito',
        TAXES_FOUND: 'Impuestos encontrados',
        FORM_NOT_SUPPORTED: 'Formulario no soportado actualmente',
        FORM_INVALID_DATA: 'Hay algún error en los datos del formulario',
        TAX_NOT_FOUND: 'Los datos fiscales no se han guardado. Por favor, guarde primero los datos fiscales',
        TAX_UPDATED: 'Datos fiscales se han guardado correctamente',
        CONFIG_FETCHED: 'Configuración obtenida con éxito',
        COMMENT_ADDED: 'Comentario añadido',
        COMMENT_STATUS_CHANGED: "El estado del comentario ha cambiado",
        INCOME_NOT_FOUND: "Ingresos no encontrados",
        FORMS_FETCHED: 'Formularios obtenidos',
        USERS_FETCHED: 'Usuarios obtenidos',
    }
}