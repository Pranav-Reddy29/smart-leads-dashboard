import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../../providers/ThemeProvider";

describe("ThemeToggle", () => {
  it("switches the document theme", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(
      document.documentElement.dataset.theme
    ).toBe("light");

    fireEvent.click(
      screen.getByRole("button", {
        name: /dark/i,
      })
    );

    expect(
      document.documentElement.dataset.theme
    ).toBe("dark");
  });
});
