import express from "express";

import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/lead.controller";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createLeadSchema,
  leadIdSchema,
  leadQuerySchema,
  updateLeadSchema,
} from "../validations/schemas";

const router = express.Router();

router.use(protect);

router.get("/", validate(leadQuerySchema), getLeads);

router.post(
  "/",
  validate(createLeadSchema),
  createLead
);

router.get(
  "/:id",
  validate(leadIdSchema),
  getLeadById
);

router.put(
  "/:id",
  validate(updateLeadSchema),
  updateLead
);

router.delete(
  "/:id",
  validate(leadIdSchema),
  adminOnly,
  deleteLead
);

export default router;
