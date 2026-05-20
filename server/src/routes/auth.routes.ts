import express from "express";

import {
  acceptInvitation,
  getCurrentOrganization,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  acceptInvitationSchema,
  loginSchema,
  registerSchema,
} from "../validations/schemas";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

router.post(
  "/invitations/accept",
  validate(acceptInvitationSchema),
  acceptInvitation
);

router.get("/me", protect, getCurrentUser);

router.get(
  "/organization",
  protect,
  getCurrentOrganization
);

export default router;
