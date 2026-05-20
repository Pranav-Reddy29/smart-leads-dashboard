import LeadForm from "./LeadForm";
import type { LeadFormValues } from "../../types/lead.types";

function CreateLeadForm({
  onSubmit,
}: {
  onSubmit: (values: LeadFormValues) => Promise<void>;
}) {
  return (
    <LeadForm
      submitLabel="Create lead"
      onSubmit={onSubmit}
    />
  );
}

export default CreateLeadForm;
