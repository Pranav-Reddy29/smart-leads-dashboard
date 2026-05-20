export const AUTH_STORAGE_KEY =
  "smart-leads-auth";

export const THEME_STORAGE_KEY =
  "smart-leads-theme";

export const getStoredToken = () => {
  const rawValue =
    localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as {
      state?: { token?: string | null };
    };

    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
};
