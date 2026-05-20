import express from "express";

import {
  getUsers,
  inviteUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  inviteUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validations/schemas";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getUsers);

router.post(
  "/invite",
  validate(inviteUserSchema),
  inviteUser
);

router.patch(
  "/:id/role",
  validate(updateUserRoleSchema),
  updateUserRole
);

router.patch(
  "/:id/status",
  validate(updateUserStatusSchema),
  updateUserStatus
);

export default router;
