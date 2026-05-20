export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Lost";

export type LeadSource =
  | "Website"
  | "Instagram"
  | "Referral";

export interface Activity {
  _id: string;
  action: string;
  description: string;
  timestamp: string;
  by: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}
