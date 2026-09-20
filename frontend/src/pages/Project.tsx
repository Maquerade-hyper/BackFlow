import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Code2,
  GitBranch,
  Rocket,
  TestTube,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import type { Project } from "../types";

export default function Project() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        const response = await api.get<Project>(
          `/projects/${projectId}`
        );

        setProject(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ||
            "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-gray-500">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-red-400">
        {error || "Project not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <Link
        to={`/app/workspaces/${project.workspace_id}`}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to workspace
      </Link>

      <div className="mt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Code2 size={20} />
          </div>

          <div>
            <h1 className="text-3xl font-semibold">
              {project.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {project.description ||
                "No project description."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <GitBranch size={20} />

          <h2 className="mt-5 font-medium">
            Build
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Visual application graph and architecture
            editor.
          </p>

          <span className="mt-5 inline-block text-xs uppercase tracking-wider text-gray-600">
            V1
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <TestTube size={20} />

          <h2 className="mt-5 font-medium">
            Test
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Test and validate your application.
          </p>

          <span className="mt-5 inline-block text-xs uppercase tracking-wider text-gray-600">
            V5
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Rocket size={20} />

          <h2 className="mt-5 font-medium">
            Deploy
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Deploy and observe applications.
          </p>

          <span className="mt-5 inline-block text-xs uppercase tracking-wider text-gray-600">
            V6
          </span>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <div className="text-xs uppercase tracking-widest text-gray-600">
          Project ID
        </div>

        <div className="mt-2 font-mono text-sm text-gray-400">
          {project.id}
        </div>

        <div className="mt-6 text-xs uppercase tracking-widest text-gray-600">
          Status
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Foundation ready
        </div>
      </div>
    </div>
  );
}