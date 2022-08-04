import { IUser } from "@/interfaces/users.interface";

export const filterCurrentUser = (user: IUser) : IUser => {
    delete user.password
    return user
}