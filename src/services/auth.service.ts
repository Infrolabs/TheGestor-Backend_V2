import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { getNameAndSurname, isEmpty } from '@utils/util';
import { ResponseCodes, ResponseMessages } from '@/interfaces/response.interface';
import OtpService from './otp.service';
import { EPremiumType } from '@/interfaces/premium.interface';
import HubspotService from './hubspot.service';
import EmailService from './email.service';
import { filterCurrentUser } from '@/utils/filters';

class AuthService {
  private otpService = new OtpService()
  private hubspotService = new HubspotService()
  private emailService = new EmailService()

  public async verifyExists(user: IUser): Promise<void> {
    const existingUser = await userModel.findOne({
      $or: [
        { email: user.email },
        { phoneNumber: user.phoneNumber, countryCode: user.countryCode }
      ]
    })
    if (existingUser && existingUser.email === user.email)
      throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.EMAIL_EXISTS)
    if (existingUser && existingUser.phoneNumber === user.phoneNumber)
      throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.PHONE_EXISTS)

    // SENDS CODE
    this.otpService.sendOtp(user.countryCode + "" + user.phoneNumber)
  }

  public async signup(userData: IUser, otp: string): Promise<{ token: string; user: IUser }> {
    const existingUser = await userModel.findOne({
      $or: [
        { email: userData.email },
        { phoneNumber: userData.phoneNumber, countryCode: userData.countryCode }
      ]
    })
    if (existingUser && existingUser.email === userData.email)
      throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.EMAIL_EXISTS)
    if (existingUser && existingUser.phoneNumber === userData.phoneNumber)
      throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.PHONE_EXISTS)

    this.otpService.verifyOtp(userData.countryCode + "" + userData.phoneNumber, otp)

    const today = new Date()
    today.setHours(9, 0, 0)
    const expiryDate = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000)
    userData.password = await hash(userData.password, 10);
    userData.premiumType = EPremiumType.TRIAL
    userData.trialExpiryDate = expiryDate

    let user = new userModel(userData);
    user = await user.save();
    user = user.toObject()
    const { name, surname } = getNameAndSurname(user.name)
    this.hubspotService.createContact(name, surname, user.email, user.countryCode, user.phoneNumber, user.companyName)
    this.emailService.sendWelcomeMail(user.name, user.email)

    const token = this.createToken(user);

    return { token, user: filterCurrentUser(user as IUser) }
  }

  public async login(userData: IUser): Promise<{ token: string; user: IUser }> {
    const user = await userModel.findOne({ email: userData.email }).lean();
    if (!user)
      throw new HttpException(ResponseCodes.NOT_FOUND, ResponseMessages.EMAIL_NOT_REGISTERED)

    const isMatch = await compare(userData.password, user.password);
    if (!isMatch)
      throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.PASSWORD_INCORRECT)

    const token = this.createToken(user)
    return { token, user: filterCurrentUser(user) };
  }

  // public async logout(userData: User): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

  //   const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
  //   if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

  //   return findUser;
  // }

  public createToken(user: IUser): string {
    const dataStoredInToken: DataStoredInToken = { user: { id: user._id } }
    const secretKey: string = SECRET_KEY;

    return sign(dataStoredInToken, secretKey);
  }
}

export default AuthService;
