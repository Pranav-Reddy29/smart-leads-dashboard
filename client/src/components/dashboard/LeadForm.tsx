import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../common/Button";
import Input from "../forms/Input";
import type { LeadFormValues } from "../../types/lead.types";

const leadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  status: z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Lost",
  ]),
  source: z.enum([
    "Website",
    "Instagram",
    "Referral",
  ]),
  notes: z.string().optional(),
});

interface LeadFormProps {
  initialValues?: LeadFormValues;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  submitLabel: string;
}

function LeadForm({
  initialValues,
  onSubmit,
  submitLabel,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues:
      initialValues ?? {
        name: "",
        email: "",
        status: "New",
        source: "Website",
        notes: "",
      },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Lead name"
        placeholder="Jordan Smith"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Email"
        type="email"
        placeholder="jordan@company.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Status
          </span>
          <select
            {...register("status")}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Source
          </span>
          <select
            {...register("source")}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          Notes (Optional)
        </span>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Add any helpful context about this lead..."
          className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </label>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default LeadForm;
