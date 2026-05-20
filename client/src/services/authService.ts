import axiosInstance from "../api/axios";
import type {
  AcceptInvitationFormData,
  AuthSession,
  LoginFormData,
  RegisterFormData,
} from "../types/auth.types";
import type { ApiResponse } from "../types/api.types";
import type { Organization } from "../types/organization.types";
import type { WorkspaceUser } from "../types/user.types";

export const registerUser = async (
  data: RegisterFormData
) => {
  const response =
    await axiosInstance.post<
      ApiResponse<AuthSession>
    >("/auth/register", data);

  return response.data.data;
};

export const loginUser = async (
  data: LoginFormData
) => {
  const response =
    await axiosInstance.post<
      ApiResponse<AuthSession>
    >("/auth/login", data);

  return response.data.data;
};

export const acceptInvitation = async (
  data: AcceptInvitationFormData
) => {
  const response =
    await axiosInstance.post<
      ApiResponse<AuthSession>
    >("/auth/invitations/accept", data);

  return response.data.data;
};

export const getCurrentUser = async () => {
  const response =
    await axiosInstance.get<
      ApiResponse<WorkspaceUser>
    >("/auth/me");

  return response.data.data;
};

export const getCurrentOrganization =
  async () => {
    const response =
      await axiosInstance.get<
        ApiResponse<Organization>
      >("/auth/organization");

    return response.data.data;
  };

export const bootstrapSession = async () => {
  const [user, organization] =
    await Promise.all([
      getCurrentUser(),
      getCurrentOrganization(),
    ]);

  return {
    user,
    organization,
  };
};
