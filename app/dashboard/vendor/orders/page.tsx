"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const d = await apiFetch("/api/orders/vendor");
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

  async function update(id: string, status: "accepted" | "rejected") {
    try {
      const d = await apiFetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(d.message);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <h1 className="text-2xl font-bold">Customer Orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o._id} className="space-y-2 rounded-lg border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold">{o.item.itemName}</p>
              <p className="text-sm text-muted-foreground">
                {o.customer.name} ({o.customer.email})
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(o.deliveryDate).toLocaleDateString()} · {o.deliveryAddress}
              </p>
              {o.message && <p className="text-sm italic">"{o.message}"</p>}
            </div>
            <Badge variant="secondary" className="capitalize">{o.status}</Badge>
          </div>
          {o.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => update(o._id, "accepted")}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => update(o._id, "rejected")}>Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}