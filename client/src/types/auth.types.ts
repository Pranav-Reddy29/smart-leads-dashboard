import type { Organization } from "./organization.types";
import type { WorkspaceUser } from "./user.types";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface AcceptInvitationFormData {
  token: string;
  name: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: WorkspaceUser;
  organization: Organization;
}
