import { EPremiumType } from "./premium.interface"

export interface IUser {
  _id: string
  name: string
  companyName: string
  email: string
  countryCode: string
  phoneNumber: string
  image: string
  password?: string
  cifNif: string
  areaHome: string
  areaOffice: string
  address: string
  city: string
  zipCode: string
  province: string
  country: string
  website: string
  iae: string
  cnae: string
  isVerified: string
  userType: EUserType
  officeType: string
  bank: IUserBankInfo
  bizum: IUserBizum
  platform: EUserPlatform
  nordigenRequisitionId: string
  accounts: IUserBankAccount[]
  invoiceLogo: string
  invoiceLanguage: ELanguage
  adminNote: string
  taxConfig: IUserTaxConfig
  userAnswer: IUserAnswers
  notificationSettings: IUserNotificationSettings
  language: ELanguage
  lastBilling: string
  premiumType: EPremiumType
  trialExpiryDate: Date
  billingInfo: IUserBillingInfo
}

export interface IUserBankInfo {
  bankName: string
  accountHolder: string
  iban: string
  swiftCode: string
}

export interface IUserBizum {
  mobileNumber: string
}

export interface IUserBankAccount {
  accountId: string
  bankLogo: string
  name: string
  iban: string
  institution_id: string
  isRefreshing: boolean
  balances: IUserBankBalance[]
}

export interface IUserBankBalance {
  balanceAmount: Object
  balanceType: string
  referenceDate: string
}

export interface IUserTaxConfig {
  form303: boolean
  form390: boolean
  form349Q: boolean
  form349A: boolean
  form111: boolean
  form190: boolean
  form347: boolean
  form130: boolean
  form100: boolean
  form115: boolean
  form180: boolean
}

export interface IUserAnswers {
  answer1: EUserAnswer1
  answer2: EUserAnswer2
  answer3: EUserAnswer3
}

export interface IUserNotificationSettings {
  pendingInvoices: boolean
  taxes: boolean
}

export interface IUserBillingInfo {
  name: String,
  address: String,
  cifNif: String,
  email: String,
  province: String,
  country: String,
  zipCode: String,
  city: String
}

// -------------- ENUMS -----------------------
export enum ELanguage {
  EN = 'en',
  ES = 'es'
}

export enum EUserType {
  FREELANCER = 'freelancer',
  COMPANY = 'company',
  ACCOUNTING_FIRM = 'accounting_firm'
}

export enum EUserPlatform {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web'
}

export enum EUserAnswer1 {
  NOBODY = 'nobody',
  MYSELF = 'myself',
  ACCOUNTANT = 'accountant'
}

export enum EUserAnswer2 {
  SEARCH_ENGINE = 'search_engine',
  SOCIAL_MEDIA = 'social_media',
  FRIEND = 'friends',
  OTHERS = 'others'
}

export enum EUserAnswer3 {
  INVOICES = 'invoices',
  MANAGEMENT = 'management',
  TAXES = 'taxes',
  INCOME_EXPENSE = 'income_expense',
  ALL = 'all'
}