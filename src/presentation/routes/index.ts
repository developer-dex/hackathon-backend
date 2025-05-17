import { Router } from "express";
import { authRouter } from "./authRoutes";
import { categoryRouter } from "./categoryRoutes";

// Create a main router that combines all routes
const router = Router();

// Register all route modules with their prefixes
router.use("/auth", authRouter);
router.use("/categories", categoryRouter);

// Export the combined router
export default router;
