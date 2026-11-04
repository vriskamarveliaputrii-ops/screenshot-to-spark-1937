import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/Common";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReport } from "@/hooks/useReports";
import { ReportForm } from "./ReportForm";

export function ReportEditPage({ id }: { id: number }) {
  const { data, isLoading, isError } = useReport(id);
  if (isLoading) return <div className="mx-auto max-w-3xl space-y-4"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-96 w-full" /></div>;
  if (isError || !data) return <EmptyState title="Laporan tidak ditemukan" action={<Button asChild><Link to="/reports">Kembali ke daftar</Link></Button>} />;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit Laporan" description={data.title} />
      <Alert className="mb-6 border-progress/30 bg-progress-soft text-progress">
        <Info className="size-4" />
        <AlertDescription className="text-progress">Laporan hanya bisa diedit selama status masih Pending.</AlertDescription>
      </Alert>
      <ReportForm report={data} />
    </div>
  );
}
