import type { Request, Response } from "express";
import mongoose from "mongoose";

import Lead from "../models/lead.model";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

const ensureTenantContext = (
  req: Request
) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
};

export const createLead = asyncHandler(
  async (req: Request, res: Response) => {
    const user = ensureTenantContext(req);

    const existingLead =
      await Lead.findOne({
        organization:
          user.organizationId,
        email: req.body.email.toLowerCase(),
      });

    if (existingLead) {
      throw new AppError(
        409,
        "A lead with this email already exists in your workspace"
      );
    }

    const lead = await Lead.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
      organization: user.organizationId,
      createdBy: user._id,
      updatedBy: user._id,
      notes: req.body.notes || "",
      activities: [
        {
          action: "Lead Created",
          description: "Lead was added to the system",
          by: user._id,
        },
      ],
    });

    return sendSuccess(res, {
      statusCode: 201,
      message:
        "Lead created successfully",
      data: lead,
    });
  }
);

export const getLeads = asyncHandler(
  async (req: Request, res: Response) => {
    const user = ensureTenantContext(req);
    const {
      status,
      source,
      search,
      sort,
      page = 1,
      limit = 10,
    } = req.query as Record<
      string,
      string
    > & {
      page?: number;
      limit?: number;
    };

    const numericPage = Number(page || 1);
    const numericLimit = Number(limit || 10);
    const skip =
      (numericPage - 1) * numericLimit;

    const query: Record<
      string,
      unknown
    > = {
      organization: new mongoose.Types.ObjectId(
        user.organizationId
      ),
    };

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 as const }
        : { createdAt: -1 as const };

    const [leads, total] =
      await Promise.all([
        Lead.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(numericLimit)
          .lean(),
        Lead.countDocuments(query),
      ]);

    return sendSuccess(res, {
      data: leads,
      pagination: {
        total,
        page: numericPage,
        totalPages:
          Math.ceil(total / numericLimit) ||
          1,
        limit: numericLimit,
      },
    });
  }
);

export const getLeadById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = ensureTenantContext(req);

    const lead = await Lead.findOne({
      _id: req.params.id,
      organization:
        user.organizationId,
    })
      .populate("activities.by", "name email")
      .lean();

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    return sendSuccess(res, {
      data: lead,
    });
  }
);

export const updateLead = asyncHandler(
  async (req: Request, res: Response) => {
    const user = ensureTenantContext(req);

    const lead = await Lead.findOne({
      _id: req.params.id,
      organization:
        user.organizationId,
    });

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    const duplicateLead =
      await Lead.findOne({
        _id: { $ne: lead._id },
        organization:
          user.organizationId,
        email: req.body.email.toLowerCase(),
      });

    if (duplicateLead) {
      throw new AppError(
        409,
        "A lead with this email already exists in your workspace"
      );
    }

    if (lead.status !== req.body.status) {
      lead.activities.push({
        action: "Status Updated",
        description: `Status changed from ${lead.status} to ${req.body.status}`,
        by: user._id as any,
      });
    } else {
      lead.activities.push({
        action: "Lead Updated",
        description: "Lead details were modified",
        by: user._id as any,
      });
    }

    lead.name = req.body.name;
    lead.email = req.body.email.toLowerCase();
    lead.status = req.body.status;
    lead.source = req.body.source;
    if (req.body.notes !== undefined) {
      lead.notes = req.body.notes;
    }
    lead.updatedBy =
      new mongoose.Types.ObjectId(
        user._id as string
      );

    await lead.save();

    return sendSuccess(res, {
      message:
        "Lead updated successfully",
      data: lead,
    });
  }
);

export const deleteLead = asyncHandler(
  async (req: Request, res: Response) => {
    const user = ensureTenantContext(req);

    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      organization:
        user.organizationId,
    });

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    return sendSuccess(res, {
      data: {
        _id: lead._id.toString(),
      },
      message:
        "Lead deleted successfully",
    });
  }
);
