import { config } from 'dotenv';
config({ path: '.env' });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { 
    NODE_ENV, 
    PORT, 
    SECRET_KEY, 
    LOG_FORMAT, 
    LOG_DIR, 
    ORIGIN,
    MONGODB_URI,
    FROM_EMAIL,
    FROM_EMAIL_PASSWORD,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_ID,
    HUBSPOT_API_KEY,
    REDSYS_SECRET_KEY,
    REDSYS_MERCHANT_NAME,
    REDSYS_MERCHANT_CODE,
    REDSYS_MERCHANT_TERMINAL,
    REDSYS_MERCHANT_URL,
    REDSYS_SUCCESS_URL,
    REDSYS_ERROR_URL,
    REDSYS_URL,
    REDSYS_SOAP_URL
} = process.env;
