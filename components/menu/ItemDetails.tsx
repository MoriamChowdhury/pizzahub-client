"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, MapPin, Store, Crown } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Detail = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  vendorId: string;
  vendor: {
    _id: string;
    name: string;
    businessName?: string;
    image?: string;
    subscriptionPlan?: string;
  };
};

export default function ItemDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [item, setItem] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace(`/sign-in?redirect=/menu/${id}`);
      return;
    }
    apiFetch<{ item: Detail }>(`/api/menu/${id}`)
      .then((d) => setItem(d.item))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <AlertTriangle className="h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold">Item not available</h1>
        <p className="text-muted-foreground">{error || "This menu item could not be found."}</p>
        <Button asChild><Link href="/menu">Back to Menu</Link></Button>
      </div>
    );
  }

  const user = session!.user;
  const role = user.role as string;
  const isOwn = item.vendorId === user.id;
  const isApproved = item.status === "approved";
  const isPremium = item.vendor?.subscriptionPlan === "premium";

  let orderState: { disabled: boolean; note?: string } = { disabled: false };
  if (!isApproved) orderState = { disabled: true, note: "This item is not available for ordering." };
  else if (role === "admin") orderState = { disabled: true, note: "Admins cannot place orders." };
  else if (role === "vendor") {
    orderState = {
      disabled: true,
      note: isOwn ? "You cannot order your own item." : "Vendors cannot place orders.",
    };
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      {/* Gallery */}
      <div className="space-y-3">
        <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.images[active]} alt={item.itemName} className="h-full w-full object-cover" />
        </div>
        {item.images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {item.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  i === active ? "border-primary" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{item.category}</Badge>
          {!isApproved && <Badge variant="outline" className="capitalize">{item.status}</Badge>}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">{item.itemName}</h1>
        <p className="text-3xl font-extrabold text-primary">৳{item.price}</p>

        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" /> {item.location}
        </p>

        <div className="rounded-xl border bg-white p-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Restaurant</p>
          <p className="flex items-center gap-2 font-semibold">
            <Store className="h-4 w-4 text-primary" />
            {item.vendor.businessName || item.vendor.name}
            {isPremium && (
              <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
                <Crown className="h-3 w-3" /> Premium
              </Badge>
            )}
          </p>
        </div>

        <div>
          <h2 className="mb-1 font-semibold">Description</h2>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{item.description}</p>
        </div>

        <div className="space-y-2 pt-2">
          <Button size="lg" className="w-full sm:w-auto" disabled={orderState.disabled}>
            Order Now
          </Button>
          {orderState.note && <p className="text-sm text-muted-foreground">{orderState.note}</p>}
        </div>
      </div>
    </div>
  );
}