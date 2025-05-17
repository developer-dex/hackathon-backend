import app from "./presentation/app";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

// Connect to MongoDB
mongoose.connect(MONGODB_URI).then(() => {
  console.log("MongoDB connected successfully");

  // Start server after successful database connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});
