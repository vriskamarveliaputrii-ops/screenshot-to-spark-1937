import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportService } from "@/services/reportService";
import { dashboardService } from "@/services/dashboardService";
import type { ReportQueryParams, ReportStatus } from "@/types";

export const useReports = (params: ReportQueryParams) =>
  useQuery({ queryKey: ["reports", params], queryFn: () => reportService.getReports(params), placeholderData: keepPreviousData });

export const useAllReports = () =>
  useQuery({ queryKey: ["reports", "all"], queryFn: () => reportService.getAllReports() });

export const useReport = (id: number) =>
  useQuery({ queryKey: ["report", id], queryFn: () => reportService.getReport(id), retry: false });

export const useDashboardStats = (userId?: number) =>
  useQuery({ queryKey: ["dashboard", userId ?? "all"], queryFn: () => dashboardService.getDashboardStats(userId) });

const errorToast = (e: unknown) => toast.error(e instanceof Error ? e.message : "Terjadi kesalahan");

export function useDeleteReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reportService.deleteReport(id),
    onSuccess: () => { toast.success("Laporan dihapus"); qc.invalidateQueries({ queryKey: ["reports"] }); },
    onError: errorToast,
  });
}

export function useSaveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: FormData }) =>
      id ? reportService.updateReport(id, data) : reportService.createReport(data),
    onSuccess: (_r, v) => {
      toast.success(v.id ? "Laporan berhasil diperbarui" : "Laporan berhasil dikirim", {
        description: v.id ? undefined : "Admin akan segera menindaklanjuti laporanmu.",
      });
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: errorToast,
  });
}

export function useUpdateReportStatus(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { status: ReportStatus; note: string }) => reportService.updateReportStatus(id, p),
    onSuccess: () => { toast.success("Status laporan diperbarui"); qc.invalidateQueries({ queryKey: ["report", id] }); },
    onError: errorToast,
  });
}

export const usePredictWaste = () => useMutation({ mutationFn: (f: File) => reportService.predictWaste(f) });
