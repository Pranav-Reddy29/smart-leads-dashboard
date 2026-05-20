import LeadForm from "./LeadForm";
import type {
  Lead,
  LeadFormValues,
} from "../../types/lead.types";

function EditLeadForm({
  lead,
  onSubmit,
}: {
  lead: Lead;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}) {
  return (
    <LeadForm
      initialValues={{
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes || "",
      }}
      submitLabel="Save changes"
      onSubmit={onSubmit}
    />
  );
}

export default EditLeadForm;
