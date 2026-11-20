"use client";

import { Users, Store, UserRound, UtensilsCrossed, Clock, Receipt } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import StatCard from "@/components/dashboard/StatCard";
import { StatusPieChart, StatusBarChart } from "@/components/dashboard/Charts";
import { OverviewSkeleton, OverviewError } from "@/components/dashboard/OverviewState";

type AdminStats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
  usersByRole: Record<string, number>;
  menuByStatus: Record<string, number>;
  ordersByStatus: Record<string, number>;
};

export default function AdminOverview() {
  const { data, error, loading } = useStats<AdminStats>("/api/stats/admin");

  if (loading) return <OverviewSkeleton />;
  if (error || !data) return <OverviewError message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} />
        <StatCard title="Total Vendors" value={data.totalVendors} icon={Store} />
        <StatCard title="Total Customers" value={data.totalCustomers} icon={UserRound} />
        <StatCard title="Total Menu Items" value={data.totalMenuItems} icon={UtensilsCrossed} />
        <StatCard title="Pending Menu Items" value={data.pendingMenuItems} icon={Clock} hint="Waiting for review" />
        <StatCard title="Total Transactions" value={data.totalTransactions} icon={Receipt} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusPieChart title="Users by Role" data={data.usersByRole} />
        <StatusBarChart title="Menu Items by Status" data={data.menuByStatus} />
        <StatusPieChart title="Orders by Status" data={data.ordersByStatus} />
      </div>
    </div>
  );
}