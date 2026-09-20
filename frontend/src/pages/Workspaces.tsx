import { useEffect, useState } from "react";
import { Plus, ArrowRight, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import type { Workspace } from "../types";

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadWorkspaces = async () => {
    try {
      setLoading(true);

      const response = await api.get<Workspace[]>(
        "/workspaces"
      );

      setWorkspaces(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load workspaces."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const createWorkspace = async () => {
    if (!name.trim()) return;

    try {
      setCreating(true);
      setError("");

      const response = await api.post<Workspace>(
        "/workspaces",
        {
          name: name.trim(),
        }
      );

      setWorkspaces((current) => [
        ...current,
        response.data,
      ]);

      setName("");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to create workspace."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Workspaces
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your application engineering environments.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Plus size={18} />

          <h2 className="font-medium">
            Create workspace
          </h2>
        </div>

        <div className="mt-5 flex gap-3">
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                createWorkspace();
              }
            }}
            placeholder="Workspace name"
            className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/30"
          />

          <button
            onClick={createWorkspace}
            disabled={creating || !name.trim()}
            className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-40"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium">
          Your workspaces
        </h2>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading...
          </div>
        ) : workspaces.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-500">
            No workspaces yet.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                to={`/app/workspaces/${workspace.id}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <Boxes
                  size={20}
                  className="text-gray-400"
                />

                <h3 className="mt-5 font-medium">
                  {workspace.name}
                </h3>

                <p className="mt-2 text-xs text-gray-600">
                  Workspace #{workspace.id}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 group-hover:text-white">
                  Open
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}