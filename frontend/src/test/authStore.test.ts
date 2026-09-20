import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../stores/authStore";
import api from "../api/client";

vi.mock("../api/client", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("Auth Store", () => {
  beforeEach(() => {
    localStorage.clear();

    useAuthStore.setState({
      user: null,
      token: null,
      initialized: false,
    });

    vi.clearAllMocks();
  });

  it("starts with no authenticated user", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.initialized).toBe(false);
  });

  it("stores token after login", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        access_token: "test-token",
        token_type: "bearer",
      },
    });

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
    });

    await useAuthStore.getState().login(
      "test@example.com",
      "password123"
    );

    const state = useAuthStore.getState();

    expect(state.token).toBe("test-token");
    expect(state.user).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    });

    expect(localStorage.getItem("backflow_token")).toBe("test-token");
  });

  it("clears authentication on logout", async () => {
    useAuthStore.setState({
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
      token: "test-token",
      initialized: true,
    });

    localStorage.setItem("backflow_token", "test-token");

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem("backflow_token")).toBeNull();
  });
});