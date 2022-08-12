import { NODE_ENV, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_ID } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { ResponseCodes, ResponseMessages } from "@/interfaces/response.interface";
import { Twilio } from "twilio";

class OtpService {
  private twilio = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  public async sendOtp(phone: string): Promise<void> {
    // return if development env
    if (NODE_ENV === "development")
      return
    // SENDS CODE
    this.twilio.verify.services(TWILIO_SERVICE_ID)
      .verifications
      .create({ to: phone, channel: 'sms' })
  }

  public async verifyOtp(phone: string, otp: string): Promise<void> {
    try {
      // return if development env
      if (NODE_ENV === "development")
        return
      const verificationCheck = await this.twilio.verify.services(TWILIO_SERVICE_ID)
        .verificationChecks
        .create({ to: phone, code: otp })
      if (verificationCheck.status !== "approved")
        throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.OTP_INCORRECT)
    } catch (e) {
      throw new HttpException(ResponseCodes.BAD_REQUEST, ResponseMessages.en.OTP_EXPIRED)
    }
  }

}

export default OtpService;
