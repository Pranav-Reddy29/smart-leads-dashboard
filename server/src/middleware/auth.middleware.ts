import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import Organization from "../models/organization.model";
import User from "../models/user.model";
import { AppError } from "../utils/appError";

interface JwtPayload {
  userId: string;
  organizationId: string;
  role: "admin" | "sales";
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new AppError(401, "Unauthorized");
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as JwtPayload;

    const user = await User.findOne({
      _id: decoded.userId,
      organization: decoded.organizationId,
    }).lean();

    if (!user || user.status !== "active") {
      throw new AppError(
        401,
        "Your account is inactive or no longer available"
      );
    }

    const organization =
      await Organization.findById(
        decoded.organizationId
      ).lean();

    if (!organization) {
      throw new AppError(
        401,
        "Organization not found"
      );
    }

    req.user = {
      _id: user._id.toString(),
      organizationId:
        user.organization.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    req.organization = {
      _id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    };

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError(401, "Unauthorized")
    );
  }
};
