import { mockReports } from "@/mocks/reports";
import type { Paginated, PredictionResult, Report, ReportQueryParams, ReportStatus, WasteCategory } from "@/types";
import { ApiError, delay, paginate } from "./http";

export function filterReports(items: Report[], p: ReportQueryParams): Report[] {
  let list = [...items];
  if (p.user_id) list = list.filter((r) => r.user.id === p.user_id);
  if (p.search) {
    const q = p.search.toLowerCase();
    list = list.filter((r) => r.title.toLowerCase().includes(q) || r.address.toLowerCase().includes(q));
  }
  if (p.status) list = list.filter((r) => r.status === p.status);
  if (p.category) list = list.filter((r) => r.category === p.category);
  if (p.from) list = list.filter((r) => r.created_at.slice(0, 10) >= p.from!);
  if (p.to) list = list.filter((r) => r.created_at.slice(0, 10) <= p.to!);
  list.sort((a, b) =>
    p.sort === "oldest" ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at),
  );
  return list;
}

export const reportService = {
  async getReports(params: ReportQueryParams = {}): Promise<Paginated<Report>> {
    await delay();
    return paginate(filterReports(mockReports, params), params.page, params.per_page ?? 10);
  },
  async getAllReports(): Promise<Report[]> {
    await delay();
    return mockReports;
  },
  async getReport(id: number): Promise<Report> {
    await delay();
    const r = mockReports.find((x) => x.id === id);
    if (!r) throw new ApiError("Laporan tidak ditemukan");
    return r;
  },
  async createReport(_formData: FormData): Promise<Report> {
    await delay(500, 800);
    return mockReports[0];
  },
  async updateReport(id: number, _formData: FormData): Promise<Report> {
    await delay(500, 800);
    return mockReports.find((x) => x.id === id) ?? mockReports[0];
  },
  async deleteReport(_id: number): Promise<void> {
    await delay();
  },
  async updateReportStatus(id: number, _payload: { status: ReportStatus; note: string }): Promise<Report> {
    await delay();
    return mockReports.find((x) => x.id === id)!;
  },
  async predictWaste(_file: File): Promise<PredictionResult> {
    await delay(1300, 1700);
    const labels: WasteCategory[] = ["organic", "plastic", "paper"];
    if (Math.random() < 0.25) {
      return { label: null, confidence: 0.41, probabilities: { organic: 0.41, plastic: 0.34, paper: 0.25 }, uncertain: true };
    }
    const label = labels[Math.floor(Math.random() * 3)];
    const confidence = 0.8 + Math.random() * 0.18;
    const rest = 1 - confidence;
    const others = labels.filter((l) => l !== label);
    const split = 0.3 + Math.random() * 0.4;
    const probabilities = { [label]: confidence, [others[0]]: rest * split, [others[1]]: rest * (1 - split) } as Record<WasteCategory, number>;
    return { label, confidence, probabilities, uncertain: false };
  },
};
