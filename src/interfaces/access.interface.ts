export interface IAccess {
    _id: string
    user: string
    email: string,
    accessType: EAccessType
    status: EAccessStatus
}

//----------- ENUMS ------------
export enum EAccessType {
    ADMIN = "admin",
    EDIT = "edit",
    READ = "read"
}

export enum EAccessStatus {
    SENT = 'sent',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}