import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Input from "../components/forms/Input";
import DashboardLayout from "../components/layout/DashboardLayout";
import SectionHeading from "../components/common/SectionHeading";
import useAuthStore from "../store/authStore";
import {
  getWorkspaceUsers,
  inviteWorkspaceUser,
  updateWorkspaceUserRole,
  updateWorkspaceUserStatus,
} from "../services/userService";
import type { ApiErrorResponse } from "../types/api.types";

function UsersPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{
    email: string;
    role: "admin" | "sales";
  }>({
    defaultValues: {
      email: "",
      role: "sales",
    },
  });

  const usersQuery = useQuery({
    queryKey: ["workspace-users"],
    queryFn: getWorkspaceUsers,
    enabled: user?.role === "admin",
  });

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["workspace-users"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["dashboard-summary"],
    });
  };

  const inviteMutation = useMutation({
    mutationFn: inviteWorkspaceUser,
    onSuccess: async (invitation) => {
      toast.success("Invitation created");

      if (invitation.deliveryMethod === "email") {
        toast.success(
          `Invitation email sent to ${invitation.email}`
        );
      } else {
        await navigator.clipboard.writeText(
          invitation.inviteUrl
        );

        toast.success("SMTP not configured, invite link copied instead");
      }

      if (invitation.deliveryStatus === "failed") {
        await navigator.clipboard.writeText(
          invitation.inviteUrl
        );
        toast.error(
          "Email delivery failed, invite link copied instead"
        );
      }

      reset();
      await refreshUsers();
    },
    onError: (error) => {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Unable to invite user"
      );
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: string;
      role: "admin" | "sales";
    }) =>
      updateWorkspaceUserRole(id, role),
    onSuccess: async () => {
      toast.success("Role updated");
      await refreshUsers();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "inactive";
    }) =>
      updateWorkspaceUserStatus(
        id,
        status
      ),
    onSuccess: async () => {
      toast.success("Status updated");
      await refreshUsers();
    },
  });

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <EmptyState
          title="Admin access required"
          description="Only workspace admins can invite teammates and manage workspace roles."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Team management"
          title="Invite and manage workspace members"
          description="Tenant admins can manage user roles and access without leaving the CRM."
        />

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-(--foreground)">
            Send invitation
          </h2>
          <p className="text-sm text-(--muted-foreground)">
            When SMTP is configured, Smart Leads emails the invite automatically. Otherwise the invite link is copied so you can send it manually.
          </p>

          <form
            className="grid gap-4 lg:grid-cols-[1fr_220px_180px]"
            onSubmit={handleSubmit(
              async (values) =>
                inviteMutation.mutateAsync(
                  values
                )
            )}
          >
            <Input
              label="Invite email"
              type="email"
              placeholder="seller@workspace.com"
              {...register("email")}
            />

            <label className="space-y-2">
              <span className="text-sm font-medium text-(--foreground)">
                Role
              </span>
              <select
                {...register("role")}
                className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--foreground) outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="sales">Sales</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <div className="flex items-end">
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Inviting..."
                  : "Invite user"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-(--surface-muted) text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.data?.map((member) => (
                  <tr
                    key={member._id}
                    className="border-t border-(--border)"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-(--foreground)">
                        {member.name}
                      </p>
                      <p className="text-sm text-(--muted-foreground)">
                        {member.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        aria-label={`Role for ${member.name}`}
                        title={`Role for ${member.name}`}
                        id={`role-select-${member._id}`}
                        value={member.role}
                        onChange={(event) => {
                          void roleMutation.mutateAsync(
                            {
                              id: member._id,
                              role: event.target
                                .value as
                                | "admin"
                                | "sales",
                            }
                          );
                        }}
                        className="rounded-2xl border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--foreground)"
                      >
                        <option value="admin">Admin</option>
                        <option value="sales">Sales</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-(--muted-foreground)">
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          void statusMutation.mutateAsync({
                            id: member._id,
                            status:
                              member.status === "active"
                                ? "inactive"
                                : "active",
                          })
                        }
                      >
                        {member.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default UsersPage;
