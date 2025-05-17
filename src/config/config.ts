import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 8000,
    databaseURL: process.env.MONGODB_URI || 'mongodb+srv://developerdex123:56125612@dhruvinfree.h3c2u.mongodb.net/ht-backend?retryWrites=true&w=majority',
    backendURL: process.env.BACKEND_URL || 'http://localhost:8000'
}