export interface INotification {
    _id?: string
    userId: string
    message: string
    localizationMessages: INotificationLocalizedMessages
    type: ENotificationType
    isSeen?: boolean
    notificationData?: INotificationData

}

export interface INotificationLocalizedMessages {
    es: string
    en: string
}

export interface INotificationData {
    url?: string
    type?: ENotificationDataType
    resourceId?: string
}

// -------- ENUMS -------------
export enum ENotificationType {
    TAXES = "taxes_reminder",
    TAX = "tax",
    INCOME = "income",
    INVOICE = "invoice",
    EXPENSE = "expense",
    USER_MANAGEMENT = "user_management",
    COMMENT = 'comment',
}

export enum ENotificationDataType {
    INCOME = "income",
    INVOICE = "invoice",
    EXPENSE = "expense",
}