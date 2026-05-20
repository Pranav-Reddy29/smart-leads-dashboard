import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export const generateToken = (payload: {
  userId: string;
  organizationId: string;
  role: "admin" | "sales";
}) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn:
      env.TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
