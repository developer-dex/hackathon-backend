import dotenv from 'dotenv';
import createApp from './config/app';
import connectDatabase from './infrastructure/database/connection';

// Load environment variables
dotenv.config();

// Create Express app
const app = createApp();

// Connect to MongoDB
connectDatabase()
  .then(() => {
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  }); 