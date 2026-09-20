import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../api/client";

vi.mock("../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("Workspace and Project API integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a workspace", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        id: 1,
        name: "My Workspace",
      },
    });

    const response = await api.post("/workspaces", {
      name: "My Workspace",
    });

    expect(response.data).toEqual({
      id: 1,
      name: "My Workspace",
    });

    expect(api.post).toHaveBeenCalledWith("/workspaces", {
      name: "My Workspace",
    });
  });

  it("loads workspaces", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "My Workspace",
        },
      ],
    });

    const response = await api.get("/workspaces");

    expect(response.data).toHaveLength(1);
    expect(response.data[0].name).toBe("My Workspace");
  });

  it("creates a project inside a workspace", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        id: 10,
        workspace_id: 1,
        name: "BackFlow Project",
      },
    });

    const response = await api.post("/workspaces/1/projects", {
      name: "BackFlow Project",
      description: "Test project",
    });

    expect(response.data).toEqual({
      id: 10,
      workspace_id: 1,
      name: "BackFlow Project",
    });
  });

  it("loads a project", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        id: 10,
        workspace_id: 1,
        name: "BackFlow Project",
      },
    });

    const response = await api.get("/projects/10");

    expect(response.data.id).toBe(10);
    expect(response.data.name).toBe("BackFlow Project");
  });
});