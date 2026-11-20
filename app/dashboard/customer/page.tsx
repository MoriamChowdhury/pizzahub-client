"use client";

import { ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import StatCard from "@/components/dashboard/StatCard";
import { StatusPieChart, StatusBarChart } from "@/components/dashboard/Charts";
import { OverviewSkeleton, OverviewError } from "@/components/dashboard/OverviewState";

type CustomerStats = {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  ordersByStatus: Record<string, number>;
};

export default function CustomerOverview() {
  const { data, error, loading } = useStats<CustomerStats>("/api/stats/customer");

  if (loading) return <OverviewSkeleton />;
  if (error || !data) return <OverviewError message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingBag} />
        <StatCard title="Pending Orders" value={data.pendingOrders} icon={Clock} />
        <StatCard title="Accepted Orders" value={data.acceptedOrders} icon={CheckCircle2} />
        <StatCard title="Rejected Orders" value={data.rejectedOrders} icon={XCircle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart title="Orders by Status" data={data.ordersByStatus} />
        <StatusBarChart title="Order Count" data={data.ordersByStatus} />
      </div>
    </div>
  );
}