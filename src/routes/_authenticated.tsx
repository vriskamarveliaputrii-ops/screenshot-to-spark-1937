import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { AppLayout } from "@/layouts/AppLayout";

/** ProtectedRoute (UI-only): redirects to /login when no mock user. */
export const Route = createFileRoute("/_authenticated")({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { user, ready } = useMockAuth();
  if (!ready) return <div className="grid min-h-screen place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout><Outlet /></AppLayout>;
}
