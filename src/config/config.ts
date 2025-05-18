import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT,
    databaseURL: process.env.MONGODB_URI,
    backendURL: process.env.BACKEND_URL,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    resetPasswordPath: process.env.RESET_PASSWORD_PATH,
    basecamp: {
        webhookUrl: process.env.BASECAMP_WEBHOOK_URL
    }
}