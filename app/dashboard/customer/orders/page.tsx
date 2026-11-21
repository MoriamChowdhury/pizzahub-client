"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Order = {
  _id: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: string;
  createdAt: string;
  item: { _id: string; itemName: string; images: string[]; price: number };
  vendor: { name: string; businessName?: string; email: string };
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Order | null>(null);
  const [toCancel, setToCancel] = useState<Order | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch<{ orders: Order[] }>("/api/orders/mine");
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

  async function confirmCancel() {
    if (!toCancel) return;
    setActing(true);
    try {
      const d = await apiFetch(`/api/orders/${toCancel._id}/cancel`, { method: "PATCH" });
      toast.success(d.message);
      setToCancel(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActing(false);
    }
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Requested</TableHead>
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
                  You have not placed any orders yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={o.item.images?.[0]} alt={o.item.itemName} className="h-12 w-12 rounded-md object-cover" />
                      <p className="max-w-[160px] truncate font-medium">{o.item.itemName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{o.vendor.businessName || o.vendor.name}</TableCell>
                  <TableCell>{fmt(o.deliveryDate)}</TableCell>
                  <TableCell>{fmt(o.createdAt)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setView(o)}>Details</Button>
                      {o.status === "pending" && (
                        <Button size="sm" variant="destructive" onClick={() => setToCancel(o)}>Cancel</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!toCancel}
        onOpenChange={(o) => !o && setToCancel(null)}
        title="Cancel this order?"
        description={`Your order for "${toCancel?.item.itemName}" will be cancelled.`}
        confirmText="Yes, cancel order"
        destructive
        loading={acting}
        onConfirm={confirmCancel}
      />

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Order Details</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-2 text-sm">
              <Row label="Item" value={view.item.itemName} />
              <Row label="Price" value={`৳${view.item.price}`} />
              <Row label="Vendor" value={view.vendor.businessName || view.vendor.name} />
              <Row label="Delivery date" value={fmt(view.deliveryDate)} />
              <Row label="Address" value={view.deliveryAddress} />
              <Row label="Message" value={view.message || "-"} />
              <Row label="Requested on" value={fmt(view.createdAt)} />
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={view.status} /></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}