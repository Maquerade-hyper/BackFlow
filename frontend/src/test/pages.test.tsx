import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Workspaces from "../pages/Workspaces";
import Workspace from "../pages/Workspace";
import Project from "../pages/Project";
import api from "../api/client";
import { useAuthStore } from "../stores/authStore";

vi.mock("../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("BackFlow pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthStore.setState({
      user: {
        id: 1,
        name: "Guneshwar",
        email: "guneshwar@example.com",
      },
      token: "test-token",
      initialized: true,
    });
  });

  it("renders the Home page", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Guneshwar")).toBeInTheDocument();
    expect(screen.getByText("Workspaces")).toBeInTheDocument();
    expect(screen.getByText("Visual Build")).toBeInTheDocument();
    expect(screen.getByText("AI Engineering")).toBeInTheDocument();
    expect(screen.getByText("V0 Foundation")).toBeInTheDocument();
  });

  it("loads and displays workspaces", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "Engineering",
        },
        {
          id: 2,
          name: "AI Projects",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Workspaces />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("AI Projects")).toBeInTheDocument();
    expect(screen.getByText("Workspace #1")).toBeInTheDocument();
    expect(screen.getByText("Workspace #2")).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith("/workspaces");
  });

  it("shows empty workspace state", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
    });

    render(
      <MemoryRouter>
        <Workspaces />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("No workspaces yet.")
    ).toBeInTheDocument();
  });

  it("creates a workspace", async () => {
    const user = userEvent.setup();

    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
    });

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        id: 10,
        name: "New Workspace",
      },
    });

    render(
      <MemoryRouter>
        <Workspaces />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText("Workspace name");

    await user.type(input, "New Workspace");

    await user.click(
      screen.getByRole("button", {
        name: "Create",
      })
    );

    expect(api.post).toHaveBeenCalledWith("/workspaces", {
      name: "New Workspace",
    });

    expect(
      await screen.findByText("New Workspace")
    ).toBeInTheDocument();
  });

  it("loads a workspace and its projects", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          id: 1,
          name: "Engineering",
        },
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 10,
            workspace_id: 1,
            name: "BackFlow",
            description: "Application engineering platform",
          },
        ],
      });

    render(
      <MemoryRouter initialEntries={["/app/workspaces/1"]}>
        <Routes>
          <Route
            path="/app/workspaces/:workspaceId"
            element={<Workspace />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Engineering")
    ).toBeInTheDocument();

    expect(screen.getByText("Workspace #1")).toBeInTheDocument();
    expect(screen.getByText("BackFlow")).toBeInTheDocument();
    expect(
      screen.getByText("Application engineering platform")
    ).toBeInTheDocument();

    expect(api.get).toHaveBeenNthCalledWith(
      1,
      "/workspaces/1"
    );

    expect(api.get).toHaveBeenNthCalledWith(
      2,
      "/projects/workspaces/1"
    );
  });

  it("creates a project inside a workspace", async () => {
    const user = userEvent.setup();

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          id: 1,
          name: "Engineering",
        },
      })
      .mockResolvedValueOnce({
        data: [],
      });

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        id: 20,
        workspace_id: 1,
        name: "Genesis",
        description: "3D engineering project",
      },
    });

    render(
      <MemoryRouter initialEntries={["/app/workspaces/1"]}>
        <Routes>
          <Route
            path="/app/workspaces/:workspaceId"
            element={<Workspace />}
          />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("Engineering");

    await user.type(
      screen.getByPlaceholderText("Project name"),
      "Genesis"
    );

    await user.type(
      screen.getByPlaceholderText("Description"),
      "3D engineering project"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create project",
      })
    );

    expect(api.post).toHaveBeenCalledWith(
      "/projects/workspaces/1",
      {
        name: "Genesis",
        description: "3D engineering project",
      }
    );

    expect(await screen.findByText("Genesis")).toBeInTheDocument();
    expect(
      screen.getByText("3D engineering project")
    ).toBeInTheDocument();
  });

  it("loads and displays a project", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        id: 20,
        workspace_id: 1,
        name: "BackFlow",
        description: "Application engineering platform",
      },
    });

    render(
      <MemoryRouter initialEntries={["/app/projects/20"]}>
        <Routes>
          <Route
            path="/app/projects/:projectId"
            element={<Project />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText("BackFlow")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Application engineering platform")
    ).toBeInTheDocument();

    expect(screen.getByText("Build")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Deploy")).toBeInTheDocument();

    expect(screen.getByText("Project ID")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Foundation ready")).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith("/projects/20");
  });

  it("handles a missing project", async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      response: {
        data: {
          detail: "Project not found.",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/app/projects/999"]}>
        <Routes>
          <Route
            path="/app/projects/:projectId"
            element={<Project />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Project not found.")
      ).toBeInTheDocument();
    });
  });
});