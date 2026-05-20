import type { Request, Response } from "express";
import mongoose from "mongoose";

import Invitation from "../models/invitation.model";
import Lead from "../models/lead.model";
import User from "../models/user.model";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const getDashboardSummary =
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!req.user) {
        throw new AppError(
          401,
          "Unauthorized"
        );
      }

      const organizationId =
        new mongoose.Types.ObjectId(
          req.user.organizationId
        );

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const [
        totalLeads,
        totalLeadsLast7Days,
        totalLeadsPrevious7Days,
        statusCounts,
        sourceCounts,
        recentLeads,
        activeUsers,
        pendingInvitations,
      ] = await Promise.all([
        Lead.countDocuments({
          organization: organizationId,
        }),
        Lead.countDocuments({
          organization: organizationId,
          createdAt: { $gte: sevenDaysAgo },
        }),
        Lead.countDocuments({
          organization: organizationId,
          createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
        }),
        Lead.aggregate([
          {
            $match: {
              organization: organizationId,
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
        Lead.aggregate([
          {
            $match: {
              organization: organizationId,
            },
          },
          {
            $group: {
              _id: "$source",
              count: { $sum: 1 },
            },
          },
        ]),
        Lead.find({
          organization: organizationId,
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        User.countDocuments({
          organization: organizationId,
          status: "active",
        }),
        Invitation.countDocuments({
          organization: organizationId,
          status: "pending",
        }),
      ]);

      let leadsTrend = 0;
      if (totalLeadsPrevious7Days === 0) {
        leadsTrend = totalLeadsLast7Days > 0 ? 100 : 0;
      } else {
        leadsTrend = ((totalLeadsLast7Days - totalLeadsPrevious7Days) / totalLeadsPrevious7Days) * 100;
      }

      return sendSuccess(res, {
        data: {
          totalLeads,
          activeUsers,
          pendingInvitations,
          trends: {
            totalLeads: Math.round(leadsTrend * 10) / 10,
          },
          statusBreakdown: statusCounts.map(
            (item) => ({
              label: item._id,
              count: item.count,
            })
          ),
          sourceBreakdown: sourceCounts.map(
            (item) => ({
              label: item._id,
              count: item.count,
            })
          ),
          recentLeads,
        },
      });
    }
  );
