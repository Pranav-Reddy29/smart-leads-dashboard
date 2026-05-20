import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/forms/Input";
import { acceptInvitation } from "../services/authService";
import useAuthStore from "../store/authStore";
import type { ApiErrorResponse } from "../types/api.types";

const invitationSchema = z.object({
  name: z.string().trim().min(2),
  password: z.string().min(8),
});

type InvitationValues = z.infer<
  typeof invitationSchema
>;

function AcceptInvitationPage() {
  const navigate = useNavigate();
  const { token = "" } = useParams();
  const { setSession } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationValues>({
    resolver:
      zodResolver(invitationSchema),
  });

  const onSubmit = async (
    values: InvitationValues
  ) => {
    try {
      const session =
        await acceptInvitation({
          token,
          ...values,
        });

      setSession(session);
      toast.success("Invitation accepted");
      navigate("/dashboard");
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data.message ??
          "Unable to accept invitation"
      );
    }
  };

  return (
    <div className="min-h-screen bg-(--app-background) px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <Card className="w-full max-w-xl p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Accept invitation
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-(--foreground)">
            Join your workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-(--muted-foreground)">
            Complete your account setup to access the shared pipeline and team dashboard.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Full name"
              placeholder="Priya Patel"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Joining..."
                : "Join workspace"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default AcceptInvitationPage;
