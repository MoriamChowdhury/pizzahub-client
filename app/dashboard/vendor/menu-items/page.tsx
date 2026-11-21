"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import MenuItemForm from "@/components/menu/MenuItemForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
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
};

export default function MyMenuItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Item | null>(null);
  const [edit, setEdit] = useState<Item | null>(null);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch<{ items: Item[] }>("/api/menu/vendor/mine");
      setItems(d.items);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(id: string) {
    try {
      const d = await apiFetch(`/api/menu/${id}/availability`, { method: "PATCH" });
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Menu Items</h1>
        <Button asChild>
          <Link href="/dashboard/vendor/add-item"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  You have not added any menu items yet.
                </TableCell>
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
                  <TableCell>৳{it.price}</TableCell>
                  <TableCell><StatusBadge status={it.status} /></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setView(it)}>View</Button>
                      <Button size="sm" variant="outline" onClick={() => setEdit(it)}>Edit</Button>
                      {["approved", "inactive"].includes(it.status) && (
                        <Button size="sm" variant="secondary" onClick={() => toggle(it._id)}>
                          {it.status === "approved" ? "Set Unavailable" : "Set Available"}
                        </Button>
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
        description={`"${toDelete?.itemName}" will be permanently deleted.`}
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
              <StatusBadge status={view.status} />
              <p><span className="text-muted-foreground">Category:</span> {view.category}</p>
              <p><span className="text-muted-foreground">Price:</span> ৳{view.price}</p>
              <p><span className="text-muted-foreground">Location:</span> {view.location}</p>
              <p className="whitespace-pre-line">{view.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>Edit Menu Item</DialogTitle></DialogHeader>
          {edit && (
            <>
              <p className="text-xs text-muted-foreground">
                After editing, the item goes back to Pending until an admin approves it again.
              </p>
              <MenuItemForm
                initial={edit}
                onSuccess={() => {
                  setEdit(null);
                  load();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}