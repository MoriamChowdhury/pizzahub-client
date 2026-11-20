"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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