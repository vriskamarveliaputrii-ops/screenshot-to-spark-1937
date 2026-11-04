export type Role = "admin" | "user";
export type ReportStatus = "pending" | "in_progress" | "completed" | "rejected";
export type WasteCategory = "organic" | "plastic" | "paper";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  reports_count?: number;
}

export interface ReportStatusLog {
  id: number;
  changed_by: Pick<User, "id" | "name">;
  from_status: ReportStatus | null;
  to_status: ReportStatus;
  note: string | null;
  created_at: string;
}

export interface Report {
  id: number;
  user: Pick<User, "id" | "name" | "email">;
  title: string;
  description: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  address: string;
  category: WasteCategory;
  ai_label: WasteCategory | null;
  ai_confidence: number | null;
  ai_uncertain: boolean;
  status: ReportStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  status_logs?: ReportStatusLog[];
}

export interface DashboardStats {
  total_reports: number;
  total_users: number;
  by_status: Record<ReportStatus, number>;
  by_category: Record<WasteCategory, number>;
  trend: { date: string; count: number }[];
  ai_accuracy: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; per_page: number; total: number; last_page: number };
}

export interface PredictionResult {
  label: WasteCategory | null;
  confidence: number;
  probabilities: Record<WasteCategory, number>;
  uncertain: boolean;
}

export interface ReportQueryParams {
  search?: string;
  status?: ReportStatus;
  category?: WasteCategory;
  from?: string;
  to?: string;
  sort?: "latest" | "oldest";
  page?: number;
  per_page?: number;
  user_id?: number;
}

export interface UserQueryParams {
  search?: string;
  role?: Role;
  active?: "active" | "inactive";
  page?: number;
  per_page?: number;
}
