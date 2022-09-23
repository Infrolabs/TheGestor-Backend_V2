import { Request } from 'express';
import { IUser } from '@interfaces/users.interface';

export interface DataStoredInToken {
  user: { id: string }
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface IUserRequest extends Request {
  user?: IUser;
  authToken?: string
}
