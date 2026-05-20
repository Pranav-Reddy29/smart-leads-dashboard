import axiosInstance from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type { DashboardSummary } from "../types/dashboard.types";

export const getDashboardSummary =
  async () => {
    const response =
      await axiosInstance.get<
        ApiResponse<DashboardSummary>
      >("/dashboard/summary");

    return response.data.data;
  };
