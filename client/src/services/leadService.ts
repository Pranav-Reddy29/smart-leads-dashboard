import axiosInstance from "../api/axios";
import type {
  ApiResponse,
  PaginatedResponse,
} from "../types/api.types";
import type {
  Lead,
  LeadFormValues,
} from "../types/lead.types";

export interface GetLeadsParams {
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getLeads = async (
  params: GetLeadsParams
) => {
  const response =
    await axiosInstance.get<
      PaginatedResponse<Lead>
    >("/leads", { params });

  return response.data;
};

export const getLeadById = async (
  id: string
) => {
  const response =
    await axiosInstance.get<
      ApiResponse<Lead>
    >(`/leads/${id}`);

  return response.data.data;
};

export const createLead = async (
  data: LeadFormValues
) => {
  const response =
    await axiosInstance.post<
      ApiResponse<Lead>
    >("/leads", data);

  return response.data.data;
};

export const updateLead = async (
  id: string,
  data: LeadFormValues
) => {
  const response =
    await axiosInstance.put<
      ApiResponse<Lead>
    >(`/leads/${id}`, data);

  return response.data.data;
};

export const deleteLead = async (
  id: string
) => {
  const response =
    await axiosInstance.delete<
      ApiResponse<{ _id: string }>
    >(`/leads/${id}`);

  return response.data.data;
};
