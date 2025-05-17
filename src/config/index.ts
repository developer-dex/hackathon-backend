import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/kudos-app',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d' // Token expiration time (1 day)
  },
  bcrypt: {
    saltRounds: 10
  }
}; 