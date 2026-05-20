import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import toast from "react-hot-toast";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import ErrorState from "../components/common/ErrorState";
import Pagination from "../components/common/Pagination";
import SectionHeading from "../components/common/SectionHeading";
import CreateLeadForm from "../components/dashboard/CreateLeadForm";
import EditLeadForm from "../components/dashboard/EditLeadForm";
import LeadsTable from "../components/dashboard/LeadsTable";
import TableSkeleton from "../components/dashboard/TableSkeleton";
import DashboardLayout from "../components/layout/DashboardLayout";
import useDebounce from "../hooks/useDebounce";
import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
} from "../services/leadService";
import useAuthStore from "../store/authStore";
import type { ApiErrorResponse } from "../types/api.types";
import type { Lead, LeadFormValues } from "../types/lead.types";

function LeadsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setCreateOpen] =
    useState(false);
  const [editingLead, setEditingLead] =
    useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] =
    useState<Lead | null>(null);

  const debouncedSearch = useDebounce(
    search,
    400
  );

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
      source: source || undefined,
      sort,
      page,
      limit: 10,
    }),
    [debouncedSearch, page, sort, source, status]
  );

  const leadsQuery = useQuery({
    queryKey: ["leads", queryParams],
    queryFn: () => getLeads(queryParams),
  });

  const exportQuery = useQuery({
    queryKey: ["leads-export", queryParams],
    queryFn: () =>
      getLeads({
        ...queryParams,
        page: 1,
        limit: 1000,
      }),
  });

  const refetchLeads = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["leads"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["dashboard-summary"],
    });
  };

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: async () => {
      toast.success("Lead created");
      setCreateOpen(false);
      await refetchLeads();
    },
    onError: (error) => {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Unable to create lead"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: LeadFormValues;
    }) => updateLead(id, values),
    onSuccess: async () => {
      toast.success("Lead updated");
      setEditingLead(null);
      await refetchLeads();
    },
    onError: (error) => {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Unable to update lead"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: async () => {
      toast.success("Lead removed");
      setLeadToDelete(null);
      await refetchLeads();
    },
    onError: (error) => {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Unable to delete lead"
      );
    },
  });

  const csvData = (
    exportQuery.data?.data ?? []
  ).map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    CreatedAt: new Date(
      lead.createdAt
    ).toLocaleString(),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Lead operations"
          title="Pipeline command center"
          description="Search, filter, export, and manage leads across your tenant with clean handoffs between admins and sales users."
          actions={
            <>
              <CSVLink
                data={csvData}
                filename="smart-leads-export.csv"
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-elevated) px-4 py-3 text-sm font-semibold text-(--foreground) transition hover:bg-(--surface-muted)"
              >
                <Download size={16} />
                Export CSV
              </CSVLink>
              <Button
                onClick={() => setCreateOpen(true)}
              >
                <Plus size={16} />
                New lead
              </Button>
            </>
          }
        />

        <Card className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-(--foreground)">
                Search
              </span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or email"
                className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--foreground) outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-(--foreground)">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--foreground) outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">All statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-(--foreground)">
                Source
              </span>
              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--foreground) outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">All sources</option>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-(--foreground)">
                Sort
              </span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--foreground) outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>
        </Card>

        {leadsQuery.isPending ? (
          <TableSkeleton />
        ) : leadsQuery.isError || !leadsQuery.data ? (
          <ErrorState 
            title="Failed to load leads" 
            message="We could not load leads for this workspace." 
            onRetry={refetchLeads} 
          />
        ) : (
          <>
            <LeadsTable
              leads={leadsQuery.data.data}
              isAdmin={user?.role === "admin"}
              onEdit={setEditingLead}
              onDelete={setLeadToDelete}
            />

            <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-(--muted-foreground)">
                Page {leadsQuery.data.pagination.page} of{" "}
                {leadsQuery.data.pagination.totalPages}
              </p>
              <Pagination
                currentPage={leadsQuery.data.pagination.page}
                totalPages={leadsQuery.data.pagination.totalPages}
                onPageChange={setPage}
              />
            </Card>
          </>
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Create lead"
        description="Add a new lead to this workspace. Sales users can create and update leads; only admins can delete them."
      >
        <CreateLeadForm
          onSubmit={async (values) => {
            await createMutation.mutateAsync(
              values
            );
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(editingLead)}
        onClose={() => setEditingLead(null)}
        title="Edit lead"
        description="Keep the lead record current so the workspace view stays reliable."
      >
        {editingLead ? (
          <EditLeadForm
            lead={editingLead}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync({
                id: editingLead._id,
                values,
              });
            }}
          />
        ) : null}
      </Modal>

      <Modal
        isOpen={Boolean(leadToDelete)}
        onClose={() => setLeadToDelete(null)}
        title="Delete lead"
        description="This action removes the lead from your tenant workspace. It cannot be undone."
      >
        <div className="space-y-6">
          <p className="text-sm text-(--muted-foreground)">
            Delete{" "}
            <span className="font-semibold text-(--foreground)">
              {leadToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setLeadToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                if (leadToDelete) {
                  void deleteMutation.mutateAsync(
                    leadToDelete._id
                  );
                }
              }}
              isLoading={deleteMutation.isPending}
            >
              Delete lead
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default LeadsPage;
