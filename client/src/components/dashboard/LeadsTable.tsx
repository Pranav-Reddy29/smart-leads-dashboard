import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "../common/Badge";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import type { Lead } from "../../types/lead.types";

interface LeadsTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const getStatusTone = (
  status: Lead["status"]
) => {
  switch (status) {
    case "Qualified":
      return "success";
    case "Contacted":
      return "info";
    case "Lost":
      return "danger";
    default:
      return "neutral";
  }
};

function LeadsTable({
  leads,
  isAdmin,
  onEdit,
  onDelete,
}: LeadsTableProps) {
  if (!leads.length) {
    return (
      <EmptyState
        title="No leads match this view"
        description="Try widening your filters, or create the first lead for this workspace."
      />
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            <tr>
              <th className="sticky top-0 z-10 bg-[var(--surface-muted)] px-6 py-4">Lead</th>
              <th className="sticky top-0 z-10 bg-[var(--surface-muted)] px-6 py-4">Status</th>
              <th className="sticky top-0 z-10 bg-[var(--surface-muted)] px-6 py-4">Source</th>
              <th className="sticky top-0 z-10 bg-[var(--surface-muted)] px-6 py-4">Created</th>
              <th className="sticky top-0 z-10 bg-[var(--surface-muted)] px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="group border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-muted)]/50"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">
                      {lead.name}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {lead.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={getStatusTone(lead.status)}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--foreground)]">
                  {lead.source}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                  {new Date(
                    lead.createdAt
                  ).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/leads/${lead._id}`}
                      className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                    >
                      <Pencil size={16} />
                    </button>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => onDelete(lead)}
                        className="rounded-full p-2 text-rose-500 transition hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default LeadsTable;
