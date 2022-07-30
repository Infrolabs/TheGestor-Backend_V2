export interface IArchive {
    _id: string
    folderName: string
    attachments: string[]
    createdBy: string
    isDeleted: boolean
    parent_folder_id: string
    createdAt: Date
}