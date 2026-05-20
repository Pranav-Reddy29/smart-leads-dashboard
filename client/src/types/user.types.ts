export interface WorkspaceUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  status: "active" | "inactive";
  createdAt?: string;
}

export interface Invitation {
  _id: string;
  email: string;
  role: "admin" | "sales";
  status: "pending" | "accepted" | "revoked" | "expired";
  expiresAt: string;
  inviteUrl: string;
  deliveryMethod: "email" | "manual";
  deliveryStatus:
    | "sent"
    | "smtp_not_configured"
    | "failed";
}
