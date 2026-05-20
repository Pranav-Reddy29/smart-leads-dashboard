import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import useAuthStore from "../store/authStore";

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
    render(
      <MemoryRouter initialEntries={["/leads"]}>
        <Routes>
          <Route
            path="/login"
            element={<div>Login Page</div>}
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <div>Leads Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Login Page")
    ).toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    useAuthStore.setState({
      token: "token",
      user: {
        _id: "1",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
      },
      organization: {
        _id: "1",
        name: "Workspace",
        slug: "workspace",
      },
    });

    render(
      <MemoryRouter initialEntries={["/leads"]}>
        <Routes>
          <Route
            path="/login"
            element={<div>Login Page</div>}
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <div>Leads Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Leads Page")
    ).toBeInTheDocument();
  });
});
