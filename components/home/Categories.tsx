"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Pizza, Leaf, Drumstick, Sparkles, Sandwich, CupSoda } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { CATEGORIES } from "@/lib/constants";

const icons = [Pizza, Leaf, Drumstick, Sparkles, Sandwich, CupSoda];

export default function Categories() {
  return (
    <section className="bg-orange-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Explore Pizza Categories"
          subtitle="Find exactly what you are craving"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(cat)}`}
                  className="flex h-full flex-col items-center gap-3 rounded-xl border bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-semibold">{cat}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}