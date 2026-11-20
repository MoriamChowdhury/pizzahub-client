"use client";

import Link from "next/link";
import { UtensilsCrossed, CheckCircle2, Clock, PackageCheck, Crown } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import StatCard from "@/components/dashboard/StatCard";
import { StatusPieChart, StatusBarChart } from "@/components/dashboard/Charts";
import { OverviewSkeleton, OverviewError } from "@/components/dashboard/OverviewState";
import { Button } from "@/components/ui/button";

type VendorStats = {
  totalItems: number;
  activeItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  plan: "free" | "premium";
  planLimit: number | null;
  itemsByStatus: Record<string, number>;
  ordersByStatus: Record<string, number>;
};

export default function VendorOverview() {
  const { data, error, loading } = useStats<VendorStats>("/api/stats/vendor");

  if (loading) return <OverviewSkeleton />;
  if (error || !data) return <OverviewError message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Vendor Overview</h1>
        {data.plan === "free" && (
          <Button asChild size="sm">
            <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Menu Items" value={data.totalItems} icon={UtensilsCrossed} />
        <StatCard title="Active Menu Items" value={data.activeItems} icon={CheckCircle2} hint="Approved items" />
        <StatCard title="Pending Orders" value={data.pendingOrders} icon={Clock} />
        <StatCard title="Accepted Orders" value={data.acceptedOrders} icon={PackageCheck} />
        <StatCard
          title="Current Plan"
          value={data.plan}
          icon={Crown}
          hint={data.planLimit ? `Max ${data.planLimit} active items` : "Unlimited items"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart title="Orders by Status" data={data.ordersByStatus} />
        <StatusBarChart title="Menu Items by Status" data={data.itemsByStatus} />
      </div>
    </div>
  );
}