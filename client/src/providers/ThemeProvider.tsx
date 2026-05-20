import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { THEME_STORAGE_KEY } from "../lib/storage";
import {
  ThemeContext,
  type Theme,
} from "./theme-context";

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme =
      localStorage.getItem(
        THEME_STORAGE_KEY
      );

    return storedTheme === "dark"
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;
    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme
    );
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === "light"
            ? "dark"
            : "light"
        ),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
