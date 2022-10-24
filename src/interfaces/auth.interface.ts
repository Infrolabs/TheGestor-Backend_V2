import { Request } from 'express';
import { IUser } from '@interfaces/users.interface';
import { IAdmin } from './admin.interface';

export interface DataStoredInToken {
  user: { id: string }
}

export interface AdminDataStoredInToken {
  admin: { id: string }
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface IUserRequest extends Request {
  user?: IUser
  admin?: IAdmin
  actualUser?: IUser
  authToken?: string
}
