import { z } from "zod";

const optionalString = () =>
  z.preprocess(
    (value) =>
      value === "" ? undefined : value,
    z.string().optional()
  );

const optionalEmail = () =>
  z.preprocess(
    (value) =>
      value === "" ? undefined : value,
    z.email().optional()
  );

const optionalNumber = () =>
  z.preprocess(
    (value) =>
      value === "" ? undefined : value,
    z.coerce.number().optional()
  );

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET must be at least 16 characters"),
  TOKEN_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  SMTP_HOST: optionalString(),
  SMTP_PORT: optionalNumber(),
  SMTP_USER: optionalString(),
  SMTP_PASS: optionalString(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  SMTP_FROM_EMAIL: optionalEmail(),
  SMTP_FROM_NAME: z
    .string()
    .default("Smart Leads"),
});

export const env = envSchema.parse(process.env);
