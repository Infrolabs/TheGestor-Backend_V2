export interface INotification {
    _id: string
    userId: string
    message: string
    localizationMessages: INotificationLocalizedMessages
    type: ENotificationType
    isSeen: boolean
}

export interface INotificationLocalizedMessages {
    es: string
    en: string
}

// -------- ENUMS -------------
export enum ENotificationType {
    TAXES = "taxes_reminder",
    TAX = "tax",
    INCOME = "income",
    INVOICE = "invoice",
    EXPENSE = "expense",
    USER_MANAGEMENT = "user_management"
}