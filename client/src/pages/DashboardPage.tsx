import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import DashboardLayout from "../components/layout/DashboardLayout";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import SectionHeading from "../components/common/SectionHeading";
import StatCard from "../components/dashboard/StatCard";
import { getDashboardSummary } from "../services/dashboardService";

function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  if (summaryQuery.isPending) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 max-w-lg w-full" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="space-y-3 py-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="h-[300px]">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-8" /></div>
                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
            <Card className="h-[300px]">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-2xl" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <DashboardLayout>
        <ErrorState
          title="Dashboard unavailable"
          message="We couldn't load your workspace analytics right now. Please try again."
          onRetry={() => summaryQuery.refetch()}
        />
      </DashboardLayout>
    );
  }

  const summary = summaryQuery.data;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Workspace analytics"
          title="Stay on top of pipeline health."
          description="Monitor lead volume, activation, and team momentum across your tenant from one operational dashboard."
          actions={
            <Button
              onClick={() => window.print()}
              variant="secondary"
              className="print:hidden"
            >
              <Printer size={16} />
              Print Report
            </Button>
          }
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total leads"
            value={summary.totalLeads}
            accent="linear-gradient(90deg,#0284c7,#38bdf8)"
            trend={summary.trends?.totalLeads}
          />
          <StatCard
            label="Active users"
            value={summary.activeUsers}
            accent="linear-gradient(90deg,#0f766e,#2dd4bf)"
          />
          <StatCard
            label="Pending invites"
            value={summary.pendingInvitations}
            accent="linear-gradient(90deg,#d97706,#fbbf24)"
          />
          <StatCard
            label="Recent leads"
            value={summary.recentLeads.length}
            accent="linear-gradient(90deg,#9333ea,#c084fc)"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Status distribution
            </h2>
            {summary.statusBreakdown.length ? (
              <div className="h-[280px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.statusBreakdown}>
                    <XAxis
                      dataKey="label"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface-overlay)",
                        borderColor: "var(--border)",
                        borderRadius: "16px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]}>
                      {summary.statusBreakdown.map((entry, index) => {
                        let color = "#0284c7";
                        if (entry.label === "Qualified") color = "#10b981";
                        if (entry.label === "Contacted") color = "#06b6d4";
                        if (entry.label === "Lost") color = "#f43f5e";
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-[var(--muted-foreground)]">
                  No leads yet. Create the first lead to start measuring pipeline status.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Source mix
            </h2>
            {summary.sourceBreakdown.length ? (
              <div className="h-[280px] mt-6 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.sourceBreakdown}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {summary.sourceBreakdown.map((_entry, index) => {
                        const COLORS = ["#0284c7", "#a855f7", "#ec4899", "#eab308"];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface-overlay)",
                        borderColor: "var(--border)",
                        borderRadius: "16px",
                        color: "var(--foreground)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-[var(--muted-foreground)]">
                  No source data is available yet.
                </p>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Recent leads
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {summary.recentLeads.length ? (
              summary.recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <p className="font-semibold text-[var(--foreground)]">
                    {lead.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {lead.email}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-sky-600">
                      {lead.status}
                    </span>
                    <span className="text-[var(--muted-foreground)]">
                      {new Date(
                        lead.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">
                No recent leads to show yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
