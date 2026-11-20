"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) return <p className="p-8">Loading...</p>;
  if (!session) return <p className="p-8">Not logged in</p>;

  return (
    <div className="space-y-3 p-8">
      <h1 className="text-2xl font-bold">Hello, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>

<Button
  variant="outline"
  onClick={async () => {
    try {
      const data = await apiFetch("/api/users/me");
      toast.success(`Server says role: ${data.user.role}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  }}
>
  Test Server API
</Button>

<Button
  variant="outline"
  onClick={async () => {
    try {
      const data = await apiFetch("/api/users/admin-check");
      toast.success(data.message);
    } catch (e: any) {
      toast.error(e.message);
    }
  }}
>
  Test Admin Route
</Button>

      <Button
        onClick={async () => {
          await signOut();
          router.push("/sign-in");
        }}
      >
        Logout
      </Button>
    </div>
  );
}