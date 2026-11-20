"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <section
      className="relative flex min-h-[560px] items-center bg-neutral-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-red-900/40" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-white"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/90 px-4 py-1 text-sm font-medium">
            🍕 Pizza Ordering & Delivery
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hot & Fresh Pizza Delivered to Your Door
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Discover local pizza shops, browse mouth-watering menus and order
            your favorite pizza in just a few clicks.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/menu">Explore Pizza Menu</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}