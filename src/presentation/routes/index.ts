import { Router } from "express";
import { authRouter } from "./authRoutes";
import { categoryRouter } from "./categoryRoutes";
import { teamRouter } from "./teamRoutes";
import { kudosRouter } from "./kudosRoutes";
import { analyticsRouter } from "./analyticsRoutes";
import adminRouter from "./adminRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/teams", teamRouter);
router.use("/kudos", kudosRouter);
router.use("/analytics", analyticsRouter);
router.use("/admin", adminRouter);

export default router;
