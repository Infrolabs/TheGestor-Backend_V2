import 'dotenv/config'

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
    HUBSPOT_API_KEY
} = process.env;
