import axiosInstance from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type {
  Invitation,
  WorkspaceUser,
} from "../types/user.types";

export const getWorkspaceUsers = async () => {
  const response =
    await axiosInstance.get<
      ApiResponse<WorkspaceUser[]>
    >("/users");

  return response.data.data;
};

export const inviteWorkspaceUser =
  async (payload: {
    email: string;
    role: "admin" | "sales";
  }) => {
    const response =
      await axiosInstance.post<
        ApiResponse<Invitation>
      >("/users/invite", payload);

    return response.data.data;
  };

export const updateWorkspaceUserRole =
  async (
    id: string,
    role: "admin" | "sales"
  ) => {
    const response =
      await axiosInstance.patch<
        ApiResponse<{ _id: string; role: string }>
      >(`/users/${id}/role`, {
        role,
      });

    return response.data.data;
  };

export const updateWorkspaceUserStatus =
  async (
    id: string,
    status: "active" | "inactive"
  ) => {
    const response =
      await axiosInstance.patch<
        ApiResponse<{ _id: string; status: string }>
      >(`/users/${id}/status`, {
        status,
      });

    return response.data.data;
  };
