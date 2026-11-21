"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Tx = {
  _id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  vendor?: { name: string; businessName?: string; email: string };
};

export default function TransactionsPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ transactions: Tx[] }>("/api/admin/transactions")
      .then((d) => setRows(d.transactions))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground">Payment records are read-only and cannot be edited.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No transactions yet</TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    <p className="font-medium">{t.vendor?.businessName || t.vendor?.name || "-"}</p>
                    <p className="text-xs text-muted-foreground">{t.vendor?.email}</p>
                  </TableCell>
                  <TableCell className="capitalize">{t.plan}</TableCell>
                  <TableCell>{(t.amount / 100).toFixed(2)} {t.currency?.toUpperCase()}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}