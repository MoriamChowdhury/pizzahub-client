"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Order = {
  _id: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: string;
  item: { itemName: string; images: string[] };
  customer: { name: string; email: string };
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch<{ orders: Order[] }>("/api/orders/vendor");
      setOrders(d.orders);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function update(id: string, status: "accepted" | "rejected") {
    setBusy(id);
    try {
      const d = await apiFetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(d.message);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Orders</h1>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No orders received yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>
                    <p className="font-medium">{o.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{o.customer.email}</p>
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate">{o.item.itemName}</TableCell>
                  <TableCell>
                    <p>{new Date(o.deliveryDate).toLocaleDateString()}</p>
                    <p className="max-w-[200px] truncate text-xs text-muted-foreground">{o.deliveryAddress}</p>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm">{o.message || "-"}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell>
                    {o.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" disabled={busy === o._id} onClick={() => update(o._id, "accepted")}>Accept</Button>
                        <Button size="sm" variant="outline" disabled={busy === o._id} onClick={() => update(o._id, "rejected")}>Reject</Button>
                      </div>
                    ) : (
                      <p className="text-right text-xs text-muted-foreground">No action</p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}