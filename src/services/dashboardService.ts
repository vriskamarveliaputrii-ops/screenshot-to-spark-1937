import { mockReports } from "@/mocks/reports";
import { mockTrend } from "@/mocks/stats";
import { mockUsers } from "@/mocks/users";
import type { DashboardStats } from "@/types";
import { delay } from "./http";

export const dashboardService = {
  async getDashboardStats(userId?: number): Promise<DashboardStats> {
    await delay();
    const list = userId ? mockReports.filter((r) => r.user.id === userId) : mockReports;
    const by_status = { pending: 0, in_progress: 0, completed: 0, rejected: 0 };
    const by_category = { organic: 0, plastic: 0, paper: 0 };
    list.forEach((r) => { by_status[r.status]++; by_category[r.category]++; });
    const predicted = list.filter((r) => r.ai_label);
    const matched = predicted.filter((r) => r.ai_label === r.category).length;
    return {
      total_reports: list.length,
      total_users: mockUsers.filter((u) => u.role === "user").length,
      by_status,
      by_category,
      trend: userId ? mockTrend.map((t) => ({ ...t, count: Math.round(t.count / 4) })) : mockTrend,
      ai_accuracy: predicted.length ? Math.round((matched / predicted.length) * 100) : 0,
    };
  },
};
