"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  vendor: { name: string; businessName?: string; email: string };
};

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<Item | null>(null);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    const q = new URLSearchParams();
    if (query) q.set("search", query);
    if (status !== "all") q.set("status", status);
    if (category !== "all") q.set("category", category);
    try {
      const d = await apiFetch<{ items: Item[] }>(`/api/admin/menu-items?${q.toString()}`);
      setItems(d.items);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, status, category]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: string, next: string) {
    try {
      const d = await apiFetch(`/api/admin/menu-items/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(d.message);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setActing(true);
    try {
      const d = await apiFetch(`/api/menu/${toDelete._id}`, { method: "DELETE" });
      toast.success(d.message);
      setToDelete(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActing(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Menu Items</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by item name..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No menu items found</TableCell>
              </TableRow>
            ) : (
              items.map((it) => (
                <TableRow key={it._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.images?.[0]} alt={it.itemName} className="h-12 w-12 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{it.itemName}</p>
                        <p className="truncate text-xs text-muted-foreground">{it.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{it.vendor.businessName || it.vendor.name}</TableCell>
                  <TableCell>৳{it.price}</TableCell>
                  <TableCell><StatusBadge status={it.status} /></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setView(it)}>View</Button>
                      {it.status === "pending" && (
                        <>
                          <Button size="sm" onClick={() => changeStatus(it._id, "approved")}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => changeStatus(it._id, "rejected")}>Reject</Button>
                        </>
                      )}
                      {it.status !== "pending" && (
                        <Select value={it.status} onValueChange={(v) => changeStatus(it._id, v)}>
                          <SelectTrigger size="sm" className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => setToDelete(it)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete menu item?"
        description={`"${toDelete?.itemName}" will be permanently deleted. This cannot be undone.`}
        confirmText="Delete"
        destructive
        loading={acting}
        onConfirm={confirmDelete}
      />

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{view?.itemName}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                {view.images.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" className="aspect-square rounded-md object-cover" />
                ))}
              </div>
              <p><span className="text-muted-foreground">Category:</span> {view.category}</p>
              <p><span className="text-muted-foreground">Price:</span> ৳{view.price}</p>
              <p><span className="text-muted-foreground">Location:</span> {view.location}</p>
              <p><span className="text-muted-foreground">Vendor:</span> {view.vendor.businessName || view.vendor.name} ({view.vendor.email})</p>
              <p className="whitespace-pre-line">{view.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}