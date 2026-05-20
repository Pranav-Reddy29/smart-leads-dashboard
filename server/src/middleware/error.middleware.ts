import type {
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { env } from "../config/env";
import { AppError } from "../utils/appError";

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.flatten(),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
  }

  if (
    error instanceof mongoose.Error.ValidationError
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.errors,
    });
  }

  const message =
    env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message;

  return res.status(500).json({
    success: false,
    message,
  });
};
