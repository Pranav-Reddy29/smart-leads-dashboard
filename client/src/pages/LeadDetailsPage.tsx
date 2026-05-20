import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import DashboardLayout from "../components/layout/DashboardLayout";
import EditLeadForm from "../components/dashboard/EditLeadForm";
import { getLeadById, updateLead } from "../services/leadService";
import type { ApiErrorResponse } from "../types/api.types";

function LeadDetailsPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const [isEditOpen, setEditOpen] =
    useState(false);

  const leadQuery = useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLeadById(id),
  });

  const updateMutation = useMutation({
    mutationFn: (values: {
      name: string;
      email: string;
      status: "New" | "Contacted" | "Qualified" | "Lost";
      source: "Website" | "Instagram" | "Referral";
      notes?: string;
    }) => updateLead(id, values),
    onSuccess: async () => {
      toast.success("Lead updated");
      setEditOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["lead", id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
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

  return (
    <DashboardLayout>
      {leadQuery.isPending ? (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                  <Skeleton className="h-10 w-24 rounded-2xl" />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="space-y-8">
              <Card className="space-y-6">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : leadQuery.isError || !leadQuery.data ? (
        <ErrorState 
          title="Failed to load lead" 
          message="We couldn't load this lead's details. They might have been deleted or you don't have access."
          onRetry={() => queryClient.invalidateQueries({ queryKey: ["lead", id] })}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/leads"
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-600"
            >
              <ArrowLeft size={16} />
              Back to leads
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                      Lead profile
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                      {leadQuery.data.name}
                    </h1>
                    <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                      {leadQuery.data.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => setEditOpen(true)}
                  >
                    Edit lead
                  </Button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    {
                      label: "Status",
                      value: leadQuery.data.status,
                    },
                    {
                      label: "Source",
                      value: leadQuery.data.source,
                    },
                    {
                      label: "Created",
                      value: new Date(
                        leadQuery.data.createdAt
                      ).toLocaleDateString(),
                    },
                    {
                      label: "Updated",
                      value: new Date(
                        leadQuery.data.updatedAt
                      ).toLocaleDateString(),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5"
                    >
                      <p className="text-sm font-medium text-[var(--muted-foreground)]">
                        {item.label}
                      </p>
                      <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {leadQuery.data.notes && (
                <Card className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Notes</h3>
                  <p className="whitespace-pre-wrap text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {leadQuery.data.notes}
                  </p>
                </Card>
              )}
            </div>

            <div className="space-y-8">
              <Card className="space-y-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Activity</h3>
                <div className="space-y-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {leadQuery.data.activities?.slice().reverse().map((activity: any, idx: number) => (
                    <div key={activity._id || idx} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-sky-500" />
                      {idx !== (leadQuery.data.activities?.length || 0) - 1 && (
                        <div className="absolute left-[3px] top-3 h-full w-[2px] bg-[var(--border)]" />
                      )}
                      <p className="text-sm font-medium text-[var(--foreground)]">{activity.action}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">{activity.description}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        By {activity.by?.name || "Unknown"} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {(!leadQuery.data.activities || leadQuery.data.activities.length === 0) && (
                    <p className="text-sm text-[var(--muted-foreground)]">No activity recorded yet.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isEditOpen && Boolean(leadQuery.data)}
        onClose={() => setEditOpen(false)}
        title="Edit lead"
        description="Keep this lead record accurate for everyone in the workspace."
      >
        {leadQuery.data ? (
          <EditLeadForm
            lead={leadQuery.data}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync(
                values
              );
            }}
          />
        ) : null}
      </Modal>
    </DashboardLayout>
  );
}

export default LeadDetailsPage;
