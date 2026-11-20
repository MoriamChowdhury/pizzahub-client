import Link from "next/link";
import { MapPin, Store, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { MenuItem } from "@/lib/types";

export default function MenuCard({ item }: { item: MenuItem }) {
  const isPremium = item.vendor?.subscriptionPlan === "premium";

  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images?.[0] || "/hero.jpg"}
          alt={item.itemName}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {isPremium && (
          <Badge className="absolute left-3 top-3 gap-1 bg-amber-500 text-white hover:bg-amber-500">
            <Crown className="h-3 w-3" /> Premium
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          {item.category}
        </Badge>
        <h3 className="line-clamp-1 text-lg font-bold">{item.itemName}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="line-clamp-1">{item.location}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Store className="h-4 w-4 shrink-0 text-primary" />
          <span className="line-clamp-1">
            {item.vendor?.businessName || item.vendor?.name}
          </span>
        </p>
        <p className="mt-auto pt-2 text-xl font-extrabold text-primary">
          ৳{item.price}
        </p>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/menu/${item._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}