"use client";

import { motion } from "motion/react";
import { Truck, Store, ShieldCheck, Wallet } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const features = [
  { icon: Truck, title: "Fast Delivery", text: "Choose your delivery date and get fresh pizza at your door." },
  { icon: Store, title: "Local Restaurants", text: "Discover verified pizza shops and menus near you." },
  { icon: ShieldCheck, title: "Quality Checked", text: "Every menu item is reviewed and approved by our admin team." },
  { icon: Wallet, title: "Easy Ordering", text: "Simple order flow with clear status tracking from start to finish." },
];

export default function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Why Choose PizzaHub?"
        subtitle="Everything you need for a great pizza experience"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="rounded-xl border bg-white p-6 text-center shadow-sm"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <f.icon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}