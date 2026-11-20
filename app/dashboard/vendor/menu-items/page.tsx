"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function MyItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/menu/vendor/mine")
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-6">
      <h1 className="text-2xl font-bold">My Menu Items</h1>
      {items.length === 0 && <p>No items yet.</p>}
      {items.map((i) => (
        <div key={i._id} className="rounded-lg border p-3">
          <p className="font-semibold">{i.itemName}</p>
          <p className="text-sm text-muted-foreground">
            {i.category} · ৳{i.price} · {i.status}
          </p>
        </div>
      ))}
    </div>
  );
}