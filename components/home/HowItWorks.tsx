"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  { title: "Browse the Menu", text: "Search and filter pizzas by category and location." },
  { title: "Place Your Order", text: "Pick a delivery date, add your address and special notes." },
  { title: "Restaurant Confirms", text: "The restaurant accepts your order and starts preparing." },
  { title: "Enjoy Your Pizza", text: "Track your order status and enjoy hot, fresh pizza." },
];

export default function HowItWorks() {
  return (
    <section className="bg-orange-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading title="How PizzaHub Works" subtitle="Four simple steps to your next meal" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative rounded-xl bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}