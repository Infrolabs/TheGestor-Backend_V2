export interface IClient {
    _id: string
    name: string
    favourite: boolean
    zipCode: string
    city: string
    province: string
    businessName: string
    clientType: EClientType
    phoneNumber: string
    countryCode: string
    isDeleted: boolean
    country: string
    cifNif: string
    image: string
    address: string
    email: string
    createdBy: string
}

// --------- ENUMS ------------
export enum EClientType {
    CLIENT = 'client',
    SUPPLIER = 'supplier',
}