import { Router } from "express";
import { authRouter } from "./authRoutes";
import { categoryRouter } from "./categoryRoutes";
import { kudosRouter } from "./kudosRoutes";

// Create a main router that combines all routes
const router = Router();

// Register all route modules with their prefixes
router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/kudos", kudosRouter);

// Export the combined router
export default router;
