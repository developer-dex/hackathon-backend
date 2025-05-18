import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.POR,
    databaseURL: process.env.MONGODB_URI,
    backendURL: process.env.BACKEND_URL,
    email: process.env.EMAIL ,
    password: process.env.PASSWORD,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    resetPasswordPath: process.env.RESET_PASSWORD_PATH
}