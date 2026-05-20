import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../utils/appError";

export const requireRole =
  (...roles: Array<"admin" | "sales">) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(401, "Unauthorized")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          "You do not have permission to perform this action"
        )
      );
    }

    next();
  };

export const adminOnly = requireRole("admin");
