import express from "express";

import { getDashboardSummary } from "../controllers/dashboard.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);

export default router;
