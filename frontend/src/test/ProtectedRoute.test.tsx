import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuthStore } from "../stores/authStore";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      initialized: true,
    });
  });

  it("redirects unauthenticated users to login", () => {
    render(
      <MemoryRouter initialEntries={["/app/home"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/app/home"
              element={<div>Protected Home</div>}
            />
          </Route>

          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Home")).not.toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    useAuthStore.setState({
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
      token: "test-token",
      initialized: true,
    });

    render(
      <MemoryRouter initialEntries={["/app/home"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/app/home"
              element={<div>Protected Home</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Home")).toBeInTheDocument();
  });

  it("waits while authentication is initializing", () => {
    useAuthStore.setState({
      user: null,
      token: null,
      initialized: false,
    });

    render(
      <MemoryRouter initialEntries={["/app/home"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/app/home"
              element={<div>Protected Home</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Protected Home")).not.toBeInTheDocument();
  });
});