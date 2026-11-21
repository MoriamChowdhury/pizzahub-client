import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  approved: "bg-green-100 text-green-800 hover:bg-green-100",
  accepted: "bg-green-100 text-green-800 hover:bg-green-100",
  paid: "bg-green-100 text-green-800 hover:bg-green-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  failed: "bg-red-100 text-red-800 hover:bg-red-100",
  cancelled: "bg-neutral-200 text-neutral-700 hover:bg-neutral-200",
  inactive: "bg-neutral-200 text-neutral-700 hover:bg-neutral-200",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={`capitalize ${styles[status] || "bg-neutral-100 text-neutral-700"}`}>
      {status}
    </Badge>
  );
}