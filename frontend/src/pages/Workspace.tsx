import { useEffect, useState } from "react";
import { ArrowLeft, FolderKanban, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import type { Project, Workspace } from "../types";

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!workspaceId) return;

    const load = async () => {
      try {
        const [workspaceResponse, projectsResponse] =
          await Promise.all([
            api.get<Workspace>(
              `/workspaces/${workspaceId}`
            ),
            api.get<Project[]>(
              `/projects/workspaces/${workspaceId}`
            ),
          ]);

        setWorkspace(workspaceResponse.data);
        setProjects(projectsResponse.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ||
            "Failed to load workspace."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workspaceId]);

  const createProject = async () => {
    if (!workspaceId || !projectName.trim()) return;

    try {
      setCreating(true);

      const response = await api.post<Project>(
        `/projects/workspaces/${workspaceId}`,
        {
          name: projectName.trim(),
          description: description.trim() || null,
        }
      );

      setProjects((current) => [
        ...current,
        response.data,
      ]);

      setProjectName("");
      setDescription("");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-gray-500">
        Loading workspace...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8">
        <p className="text-red-400">
          {error || "Workspace not found."}
        </p>

        <button
          onClick={() => navigate("/app/workspaces")}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-sm text-black"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <Link
        to="/app/workspaces"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white"
      >
        <ArrowLeft size={15} />
        Workspaces
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-semibold">
          {workspace.name}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Workspace #{workspace.id}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Create */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Plus size={18} />

            <h2 className="font-medium">
              New project
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <input
              value={projectName}
              onChange={(event) =>
                setProjectName(event.target.value)
              }
              placeholder="Project name"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/30"
            />

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Description"
              rows={5}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/30"
            />

            <button
              onClick={createProject}
              disabled={creating || !projectName.trim()}
              className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-40"
            >
              {creating ? "Creating..." : "Create project"}
            </button>
          </div>
        </section>

        {/* Projects */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-medium">
              Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {projects.length} project
              {projects.length === 1 ? "" : "s"}
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-500">
              Create your first project.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/app/projects/${project.id}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20"
                >
                  <FolderKanban
                    size={20}
                    className="text-gray-400"
                  />

                  <h3 className="mt-5 font-medium">
                    {project.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {project.description ||
                      "No description."}
                  </p>

                  <div className="mt-6 text-xs text-gray-600">
                    Project #{project.id}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}