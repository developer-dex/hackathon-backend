import { Router } from "express";
import { authRouter } from "./authRoutes";
import todoRouter from "./todoRoutes";

// Create a main router that combines all routes
const router = Router();

// Register all route modules with their prefixes
router.use("/auth", authRouter);
router.use("/todos", todoRouter);

// Export the combined router
export default router;
