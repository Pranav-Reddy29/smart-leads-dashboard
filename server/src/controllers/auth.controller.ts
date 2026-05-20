import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import mongoose from "mongoose";

import Organization from "../models/organization.model";
import Invitation from "../models/invitation.model";
import User from "../models/user.model";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import generateToken from "../utils/generateToken";
import { sendSuccess } from "../utils/response";
import { toSlug } from "../utils/slug";
import { hashToken } from "../utils/token";

const buildAuthResponse = async (
  userId: string
) => {
  const user = await User.findById(userId)
    .select("-password")
    .lean();

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const organization =
    await Organization.findById(
      user.organization
    ).lean();

  if (!organization) {
    throw new AppError(
      404,
      "Organization not found"
    );
  }

  const token = generateToken({
    userId: user._id.toString(),
    organizationId:
      user.organization.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    organization: {
      _id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    },
  };
};

const createUniqueSlug = async (
  organizationName: string
) => {
  const baseSlug =
    toSlug(organizationName) || "workspace";
  let slug = baseSlug;
  let counter = 1;

  while (
    await Organization.exists({
      slug,
    })
  ) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
      organizationName,
    } = req.body;

    const normalizedEmail =
      email.toLowerCase();

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

    const slug = await createUniqueSlug(
      organizationName
    );

    const passwordHash =
      await bcrypt.hash(password, 10);

    const userId = new mongoose.Types.ObjectId();

    const organization =
      await Organization.create({
        name: organizationName,
        slug,
        owner: userId,
      });

    const user = await User.create({
      _id: userId,
      organization: organization._id,
      name,
      email: normalizedEmail,
      password: passwordHash,
      role: "admin",
      status: "active",
    });

    organization.owner = user._id;
    await organization.save();

    const payload =
      await buildAuthResponse(
        user._id.toString()
      );

    return sendSuccess(res, {
      statusCode: 201,
      message:
        "Workspace created successfully",
      data: payload,
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new AppError(
        401,
        "Invalid email or password"
      );
    }

    if (user.status !== "active") {
      throw new AppError(
        403,
        "Your account is inactive"
      );
    }

    const isValidPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isValidPassword) {
      throw new AppError(
        401,
        "Invalid email or password"
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const payload =
      await buildAuthResponse(
        user._id.toString()
      );

    return sendSuccess(res, {
      message: "Login successful",
      data: payload,
    });
  }
);

export const getCurrentUser =
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!req.user) {
        throw new AppError(
          401,
          "Unauthorized"
        );
      }

      const user = await User.findById(
        req.user._id
      )
        .select("-password")
        .lean();

      if (!user) {
        throw new AppError(
          404,
          "User not found"
        );
      }

      return sendSuccess(res, {
        data: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    }
  );

export const getCurrentOrganization =
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!req.organization) {
        throw new AppError(
          404,
          "Organization not found"
        );
      }

      return sendSuccess(res, {
        data: req.organization,
      });
    }
  );

export const acceptInvitation =
  asyncHandler(
    async (req: Request, res: Response) => {
      const { token, name, password } =
        req.body;

      const invitation =
        await Invitation.findOne({
          tokenHash: hashToken(token),
          status: "pending",
        });

      if (!invitation) {
        throw new AppError(
          404,
          "Invitation not found"
        );
      }

      if (invitation.expiresAt < new Date()) {
        invitation.status = "expired";
        await invitation.save();

        throw new AppError(
          410,
          "Invitation has expired"
        );
      }

      const existingUser =
        await User.findOne({
          email: invitation.email,
        });

      if (existingUser) {
        throw new AppError(
          409,
          "A user with this email already exists"
        );
      }

      const passwordHash =
        await bcrypt.hash(password, 10);

      const user = await User.create({
        organization: invitation.organization,
        name,
        email: invitation.email,
        password: passwordHash,
        role: invitation.role,
        status: "active",
      });

      invitation.status = "accepted";
      invitation.acceptedAt = new Date();
      await invitation.save();

      const payload =
        await buildAuthResponse(
          user._id.toString()
        );

      return sendSuccess(res, {
        statusCode: 201,
        message:
          "Invitation accepted successfully",
        data: payload,
      });
    }
  );
