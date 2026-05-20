import type { Request, Response } from "express";

import Invitation from "../models/invitation.model";
import User from "../models/user.model";
import { sendInvitationEmail } from "../services/mail.service";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import {
  createInvitationToken,
  hashToken,
} from "../utils/token";

export const getUsers = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const users = await User.find({
      organization:
        req.user.organizationId,
    })
      .select("-password")
      .sort({ createdAt: 1 })
      .lean();

    return sendSuccess(res, {
      data: users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      })),
    });
  }
);

export const inviteUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const normalizedEmail =
      req.body.email.toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      throw new AppError(
        409,
        "A user with this email already exists"
      );
    }

    const existingInvitation =
      await Invitation.findOne({
        organization:
          req.user.organizationId,
        email: normalizedEmail,
        status: "pending",
      });

    if (existingInvitation) {
      throw new AppError(
        409,
        "An invitation is already pending for this email"
      );
    }

    const rawToken =
      createInvitationToken();

    const invitation =
      await Invitation.create({
        organization:
          req.user.organizationId,
        invitedBy: req.user._id,
        email: normalizedEmail,
        role: req.body.role,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(
          Date.now() +
            1000 * 60 * 60 * 24 * 7
        ),
      });

    const inviteUrl = `${process.env.CLIENT_URL}/accept-invite/${rawToken}`;
    const deliveryStatus =
      await sendInvitationEmail({
        recipientEmail: normalizedEmail,
        recipientRole: req.body.role,
        inviterName: req.user.name,
        organizationName:
          req.organization?.name ??
          "your workspace",
        inviteUrl,
      });

    return sendSuccess(res, {
      statusCode: 201,
      message:
        "Invitation created successfully",
      data: {
        _id: invitation._id.toString(),
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        inviteUrl,
        deliveryMethod:
          deliveryStatus === "sent"
            ? "email"
            : "manual",
        deliveryStatus,
      },
    });
  }
);

export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (req.user._id === req.params.id) {
      throw new AppError(
        400,
        "You cannot change your own role"
      );
    }

    const user = await User.findOne({
      _id: req.params.id,
      organization:
        req.user.organizationId,
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    user.role = req.body.role;
    await user.save();

    return sendSuccess(res, {
      message: "User role updated",
      data: {
        _id: user._id.toString(),
        role: user.role,
      },
    });
  }
);

export const updateUserStatus =
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!req.user) {
        throw new AppError(
          401,
          "Unauthorized"
        );
      }

      if (req.user._id === req.params.id) {
        throw new AppError(
          400,
          "You cannot update your own status"
        );
      }

      const user = await User.findOne({
        _id: req.params.id,
        organization:
          req.user.organizationId,
      });

      if (!user) {
        throw new AppError(
          404,
          "User not found"
        );
      }

      user.status = req.body.status;
      await user.save();

      return sendSuccess(res, {
        message: "User status updated",
        data: {
          _id: user._id.toString(),
          status: user.status,
        },
      });
    }
  );
