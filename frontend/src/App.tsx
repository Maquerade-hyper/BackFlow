import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workspaces from "./pages/Workspaces";
import Workspace from "./pages/Workspace";
import Project from "./pages/Project";

import { useAuthStore } from "./stores/authStore";

function App() {
  const initialize = useAuthStore(
    (state) => state.initialize
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<Navigate to="/app/home" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/app/home"
              element={<Home />}
            />

            <Route
              path="/app/workspaces"
              element={<Workspaces />}
            />

            <Route
              path="/app/workspaces/:workspaceId"
              element={<Workspace />}
            />

            <Route
              path="/app/projects/:projectId"
              element={<Project />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/app/home" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;