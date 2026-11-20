"use client";

import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-4 text-center">
      <Ban className="h-14 w-14 text-primary" />
      <h1 className="text-2xl font-bold">Your account has been blocked</h1>
      <p className="max-w-md text-muted-foreground">
        You cannot use protected features of PizzaHub. Please contact support if you think this is a mistake.
      </p>
      <Button
        onClick={async () => {
          await signOut();
          router.push("/");
          router.refresh();
        }}
      >
        Logout
      </Button>
    </div>
  );
}