"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Menu, LogOut, Home, LayoutDashboard, UtensilsCrossed, PlusCircle,
  ClipboardList, Crown, UserCog, Users, ShieldCheck, Receipt, ShoppingBag,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem = { label: string; href: string; icon: React.ElementType };

const navByRole: Record<string, NavItem[]> = {
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Menu Items", href: "/dashboard/vendor/menu-items", icon: UtensilsCrossed },
    { label: "Add Menu Item", href: "/dashboard/vendor/add-item", icon: PlusCircle },
    { label: "Customer Orders", href: "/dashboard/vendor/orders", icon: ClipboardList },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: Crown },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
  ],
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Menu Items", href: "/dashboard/admin/menu-items", icon: ShieldCheck },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
  ],
};

type ShellUser = { name: string; email: string; image?: string | null; role: string };

function SidebarContent({ role, onNavigate }: { role: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = navByRole[role] || navByRole.customer;
  const overview = `/dashboard/${role}`;

  const isActive = (href: string) =>
    href === overview ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-orange-50 hover:text-primary"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-orange-50 hover:text-primary"
        >
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-orange-50/40">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white lg:block">
        <SidebarContent role={user.role} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
              <SidebarContent role={user.role} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <p className="hidden text-sm font-medium text-muted-foreground lg:block">
            Welcome back, <span className="text-foreground">{user.name}</span>
          </p>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="capitalize">{user.role}</Badge>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}