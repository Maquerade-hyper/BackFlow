import {
  ArrowRight,
  Boxes,
  FolderKanban,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-10">
        <p className="text-sm text-gray-500">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {user?.name || "Engineer"}
        </h1>

        <p className="mt-3 max-w-2xl text-gray-500">
          Build applications through architecture,
          code, workflows and execution.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Link
          to="/app/workspaces"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
        >
          <Boxes size={22} className="text-gray-300" />

          <h2 className="mt-6 text-lg font-medium">
            Workspaces
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Organize your applications and engineering
            projects.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 group-hover:text-white">
            Open workspaces
            <ArrowRight size={15} />
          </div>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <GitBranch size={22} className="text-gray-300" />

          <h2 className="mt-6 text-lg font-medium">
            Visual Build
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Visual application architecture and graph
            workflows arrive in V1.
          </p>

          <div className="mt-6 text-xs uppercase tracking-wider text-gray-600">
            Coming in V1
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Sparkles size={22} className="text-gray-300" />

          <h2 className="mt-6 text-lg font-medium">
            AI Engineering
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            AI assistance will operate on the BackFlow
            engineering model in later versions.
          </p>

          <div className="mt-6 text-xs uppercase tracking-wider text-gray-600">
            Future
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8">
        <div className="flex items-center gap-3">
          <FolderKanban size={20} />

          <h2 className="text-lg font-medium">
            V0 Foundation
          </h2>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
          Authentication, workspaces and projects form
          the foundation for the visual engineering
          environment that follows.
        </p>
      </div>
    </div>
  );
}