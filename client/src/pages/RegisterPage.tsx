import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/forms/Input";
import { registerUser } from "../services/authService";
import useAuthStore from "../store/authStore";
import type { ApiErrorResponse } from "../types/api.types";
import type { RegisterFormData } from "../types/auth.types";

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8),
  organizationName: z
    .string()
    .trim()
    .min(2),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (
    values: RegisterFormData
  ) => {
    try {
      const session =
        await registerUser(values);

      setSession(session);
      toast.success("Workspace created");
      navigate("/dashboard");
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data.message ??
          "Unable to create workspace"
      );
    }
  };

  return (
    <div className="min-h-screen bg-(--app-background) px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <Card className="grid w-full gap-10 p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Create workspace
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-(--foreground)">
              Launch your tenant-ready CRM in minutes.
            </h1>
            <p className="text-sm leading-7 text-(--muted-foreground)">
              Each registration creates a fully isolated workspace with its own admin, members, and lead pipeline.
            </p>
          </div>

          <div>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Your name"
                placeholder="Ava Johnson"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Workspace name"
                placeholder="Northwind Sales"
                error={
                  errors.organizationName?.message
                }
                {...register("organizationName")}
              />

              <Input
                label="Email"
                type="email"
                placeholder="ava@northwind.com"
                error={errors.email?.message}
                {...register("email")}
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
                  ? "Creating..."
                  : "Create workspace"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-(--muted-foreground)">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-sky-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
