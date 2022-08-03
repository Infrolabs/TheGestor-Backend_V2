import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_ID } from "@/config";
import {Twilio} from "twilio";

class OtpService {
  private twilio = new Twilio(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN)
  public async sendOtp(phone: string): Promise<void> {
    // SENDS CODE
    this.twilio.verify.services(TWILIO_SERVICE_ID)
      .verifications
      .create({ to: phone, channel: 'sms' })
  }
}

export default OtpService;
