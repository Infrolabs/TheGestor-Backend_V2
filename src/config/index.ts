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
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_ID,
} = process.env;
