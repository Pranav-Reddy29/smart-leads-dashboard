import type { Types } from "mongoose";

export interface RequestUser {
  _id: string;
  organizationId: string;
  role: "admin" | "sales";
  name: string;
  email: string;
  status: "active" | "inactive";
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      organization?: {
        _id: string;
        name: string;
        slug: string;
      };
    }
  }
}

export type ObjectIdLike = Types.ObjectId | string;
