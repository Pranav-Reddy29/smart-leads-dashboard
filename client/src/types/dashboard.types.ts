import type { Lead } from "./lead.types";

export interface BreakdownItem {
  label: string;
  count: number;
}

export interface DashboardSummary {
  totalLeads: number;
  activeUsers: number;
  pendingInvitations: number;
  trends?: {
    totalLeads: number;
  };
  statusBreakdown: BreakdownItem[];
  sourceBreakdown: BreakdownItem[];
  recentLeads: Lead[];
}
