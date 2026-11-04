import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMockAuth } from "@/hooks/useMockAuth";

/** RoleRoute (UI-only): non-admins are redirected to /dashboard. */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useMockAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
