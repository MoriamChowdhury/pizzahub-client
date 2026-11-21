"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

type U = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: string;
  createdAt?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [target, setTarget] = useState<U | null>(null);
  const [acting, setActing] = useState(false);
  const [details, setDetails] = useState<{ user: U; menuItems: number; orders: number } | null>(null);

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    const q = new URLSearchParams();
    if (query) q.set("search", query);
    if (role !== "all") q.set("role", role);
    try {
      const d = await apiFetch<{ users: U[] }>(`/api/admin/users?${q.toString()}`);
      setUsers(d.users);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, role]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleBlock() {
    if (!target) return;
    setActing(true);
    try {
      const d = await apiFetch(`/api/admin/users/${target._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ blocked: !target.isBlocked }),
      });
      toast.success(d.message);
      setTarget(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActing(false);
    }
  }

  async function openDetails(id: string) {
    try {
      setDetails(await apiFetch(`/api/admin/users/${id}`));
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.image || undefined} alt={u.name} />
                        <AvatarFallback>{u.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{u.role}</Badge></TableCell>
                  <TableCell>
                    <StatusBadge status={u.isBlocked ? "rejected" : "approved"} />
                    <span className="sr-only">{u.isBlocked ? "Blocked" : "Active"}</span>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => openDetails(u._id)}>Details</Button>
                    {u.role !== "admin" && (
                      <Button
                        size="sm"
                        variant={u.isBlocked ? "default" : "destructive"}
                        onClick={() => setTarget(u)}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(o) => !o && setTarget(null)}
        title={target?.isBlocked ? "Unblock user?" : "Block user?"}
        description={
          target?.isBlocked
            ? `${target?.name} will be able to use the platform again.`
            : `${target?.name} will not be able to use protected features.`
        }
        confirmText={target?.isBlocked ? "Unblock" : "Block"}
        destructive={!target?.isBlocked}
        loading={acting}
        onConfirm={toggleBlock}
      />

      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {details && (
            <div className="space-y-2 text-sm">
              <Row label="Name" value={details.user.name} />
              <Row label="Email" value={details.user.email} />
              <Row label="Role" value={details.user.role} />
              <Row label="Account" value={details.user.isBlocked ? "Blocked" : "Active"} />
              {details.user.role === "vendor" && (
                <>
                  <Row label="Restaurant" value={details.user.businessName || "-"} />
                  <Row label="Plan" value={details.user.subscriptionPlan || "free"} />
                  <Row label="Menu items" value={String(details.menuItems)} />
                </>
              )}
              <Row label="Total orders" value={String(details.orders)} />
              <Row
                label="Joined"
                value={details.user.createdAt ? new Date(details.user.createdAt).toLocaleDateString() : "-"}
              />
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
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}