import mongoose from 'mongoose';
import supertest from 'supertest';
import dotenv from 'dotenv';
// import app from '../../src/app';

// Load environment variables
dotenv.config();

// Create supertest request object pointing to our app instance
export const request = supertest('http://192.168.10.129:8000'); 

// Get test database URL
const TEST_DB_URL = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test_db';


// Connect to test database
export const setupDatabase = async (): Promise<void> => {
  // Disconnect from any existing connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  try {
    await mongoose.connect(TEST_DB_URL);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
};

// Clear database collections
export const clearDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

// Close database connection
export const closeDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Disconnected from test database');
  }
};

// Test hooks
beforeAll(async () => {
  await setupDatabase();
});

afterEach(async () => {
  // await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
}); 