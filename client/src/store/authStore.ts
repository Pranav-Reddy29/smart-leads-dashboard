import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AUTH_STORAGE_KEY } from "../lib/storage";
import type { Organization } from "../types/organization.types";
import type { WorkspaceUser } from "../types/user.types";

interface AuthState {
  token: string | null;
  user: WorkspaceUser | null;
  organization: Organization | null;
  setSession: (payload: {
    token: string;
    user: WorkspaceUser;
    organization: Organization;
  }) => void;
  setBootstrapContext: (payload: {
    user: WorkspaceUser;
    organization: Organization;
  }) => void;
  clearSession: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      organization: null,
      setSession: ({
        token,
        user,
        organization,
      }) =>
        set({
          token,
          user,
          organization,
        }),
      setBootstrapContext: ({
        user,
        organization,
      }) =>
        set((state) => ({
          token: state.token,
          user,
          organization,
        })),
      clearSession: () =>
        set({
          token: null,
          user: null,
          organization: null,
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        organization: state.organization,
      }),
    }
  )
);

export default useAuthStore;
