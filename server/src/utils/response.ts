import type { Response } from "express";

interface SuccessOptions<T> {
  data: T;
  message?: string;
  statusCode?: number;
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  options: SuccessOptions<T>
) => {
  const {
    data,
    message = "Success",
    statusCode = 200,
    pagination,
  } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination ? { pagination } : {}),
  });
};
