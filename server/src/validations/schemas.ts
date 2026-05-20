import { z } from "zod";

const objectIdMessage = "Invalid id";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.email(),
    password: z.string().min(8),
    organizationName: z
      .string()
      .trim()
      .min(2),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

export const acceptInvitationSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    name: z.string().trim().min(2),
    password: z.string().min(8),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

export const leadBodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  status: z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Lost",
  ]),
  source: z.enum([
    "Website",
    "Instagram",
    "Referral",
  ]),
});

export const createLeadSchema = z.object({
  body: leadBodySchema,
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

export const updateLeadSchema = z.object({
  body: leadBodySchema,
  query: z.object({}).default({}),
  params: z.object({
    id: z.string().min(1, objectIdMessage),
  }),
});

export const leadIdSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({
    id: z.string().min(1, objectIdMessage),
  }),
});

export const leadQuerySchema = z.object({
  body: z.object({}).default({}),
  query: z.object({
    status: z
      .enum([
        "New",
        "Contacted",
        "Qualified",
        "Lost",
      ])
      .optional(),
    source: z
      .enum([
        "Website",
        "Instagram",
        "Referral",
      ])
      .optional(),
    search: z.string().trim().optional(),
    sort: z
      .enum(["latest", "oldest"])
      .optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(1000).default(10),
  }),
  params: z.object({}).default({}),
});

export const inviteUserSchema = z.object({
  body: z.object({
    email: z.email(),
    role: z.enum(["admin", "sales"]),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "sales"]),
  }),
  query: z.object({}).default({}),
  params: z.object({
    id: z.string().min(1, objectIdMessage),
  }),
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(["active", "inactive"]),
  }),
  query: z.object({}).default({}),
  params: z.object({
    id: z.string().min(1, objectIdMessage),
  }),
});

export const emptySchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});
