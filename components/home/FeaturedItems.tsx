"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SectionHeading from "@/components/shared/SectionHeading";
import MenuCard from "@/components/menu/MenuCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@/lib/types";

export default function FeaturedItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/featured`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setItems(d.items))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Featured Menu Items"
        subtitle="Hand-picked favorites from our top restaurants"
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-muted-foreground">
          Could not load menu items. Please try again later.
        </p>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No menu items available yet. Please check back soon!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}