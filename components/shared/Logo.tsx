import Link from "next/link";
import { Pizza } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Pizza className="h-5 w-5" />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-primary"}`}>
        PizzaHub
      </span>
    </Link>
  );
}