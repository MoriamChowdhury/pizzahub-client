import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { XIcon, FacebookIcon } from "@/components/shared/SocialIcons";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet",
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">
            Discover local pizza shops, browse hot and fresh menus, and get your
            favorite pizza delivered to your door.
          </p>
          <div className="flex gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"
               className="rounded-full bg-neutral-800 p-2 transition hover:bg-primary hover:text-white">
              <XIcon className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
               className="rounded-full bg-neutral-800 p-2 transition hover:bg-primary hover:text-white">
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c}>
                <Link href={`/menu?category=${encodeURIComponent(c)}`} className="hover:text-primary">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Chattogram, Bangladesh</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-primary" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-primary" /> support@pizzahub.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800 py-5 text-center text-xs">
        © {new Date().getFullYear()} PizzaHub. All rights reserved.
      </div>
    </footer>
  );
}