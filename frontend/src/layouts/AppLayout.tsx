import {
  FolderKanban,
  Home,
  LogOut,
  Settings,
  Boxes,
  Activity,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const navigation = [
  {
    name: "Home",
    path: "/app/home",
    icon: Home,
  },
  {
    name: "Workspaces",
    path: "/app/workspaces",
    icon: Boxes,
  },
];

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex min-h-screen bg-[#080b10] text-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#0b0f14]">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <span className="text-sm font-bold">B</span>
            </div>

            <div>
              <div className="font-semibold tracking-tight">
                BackFlow
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-600">
                Engineering Platform
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Workspace
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
                  }`
                }
              >
                <Icon size={17} />
                {item.name}
              </NavLink>
            );
          })}

          <div className="mt-8 mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Platform
          </div>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600">
            <FolderKanban size={17} />
            Build
            <span className="ml-auto text-[9px] uppercase">
              V1
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600">
            <Activity size={17} />
            Monitor
            <span className="ml-auto text-[9px] uppercase">
              V6
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600">
            <Settings size={17} />
            Settings
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {user?.name || "User"}
              </div>

              <div className="truncate text-xs text-gray-600">
                {user?.email || ""}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#080b10]/90 px-8 backdrop-blur">
          <div className="text-sm text-gray-500">
            Engineering Workspace
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-gray-500">
              V0 Foundation
            </div>

            <div className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs text-gray-600">
              Local
            </span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}