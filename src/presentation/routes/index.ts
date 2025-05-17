import { Router } from "express";
import { authRouter } from "./authRoutes";
import { categoryRouter } from "./categoryRoutes";
import { teamRouter } from "./teamRoutes";
import { kudosRouter } from "./kudosRoutes";
import { analyticsRouter } from "./analyticsRoutes";
import adminRouter from "./adminRoutes";

// Create a main router that combines all routes
const router = Router();

// Register all route modules with their prefixes
router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/teams", teamRouter);
router.use("/kudos", kudosRouter);
router.use("/analytics", analyticsRouter);
router.use("/admin", adminRouter);

// Export the combined router
export default router;
