import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/forms/Input";
import { loginUser } from "../services/authService";
import useAuthStore from "../store/authStore";
import type { ApiErrorResponse } from "../types/api.types";
import type { LoginFormData } from "../types/auth.types";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    values: LoginFormData
  ) => {
    try {
      const session =
        await loginUser(values);

      setSession(session);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data.message ??
          "Unable to sign you in"
      );
    }
  };

  return (
    <div className="min-h-screen bg-(--app-background) px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-4xl border border-(--border) bg-(radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_42%),linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
              Smart Leads
            </p>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold tracking-tight text-(--foreground)">
              Run every workspace like a focused revenue engine.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-(--muted-foreground)">
              Multi-tenant lead management with live workspace analytics, clean handoffs, and premium operator UX in both light and dark themes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Tenant-isolated workspaces",
              "Debounced search and CSV export",
              "Admin and sales role controls",
              "Responsive modern dashboard",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-(--border) bg-(--surface-elevated) px-5 py-4 text-sm font-medium text-(--foreground)"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-xl p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Sign in
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-(--foreground)">
              Welcome back
            </h2>
            <p className="mt-3 text-sm leading-6 text-(--muted-foreground)">
              Access your organization dashboard, manage leads, and collaborate with your workspace team.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Email"
                type="email"
                placeholder="you@workspace.com"
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
                  ? "Signing in..."
                  : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-(--muted-foreground)">
              New workspace?{" "}
              <Link
                to="/register"
                className="font-semibold text-sky-600"
              >
                Create one now
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
