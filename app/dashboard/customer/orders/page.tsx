"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const d = await apiFetch("/api/orders/mine");
      setOrders(d.orders);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id: string) {
    try {
      const d = await apiFetch(`/api/orders/${id}/cancel`, { method: "PATCH" });
      toast.success(d.message);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o._id} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-4">
          <div className="space-y-1">
            <p className="font-semibold">{o.item.itemName}</p>
            <p className="text-sm text-muted-foreground">
              {o.vendor.businessName || o.vendor.name} · {new Date(o.deliveryDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">{o.deliveryAddress}</p>
            <Badge variant="secondary" className="capitalize">{o.status}</Badge>
          </div>
          {o.status === "pending" && (
            <Button variant="outline" size="sm" onClick={() => cancel(o._id)}>
              Cancel
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}