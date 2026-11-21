import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";

export default async function PaymentCancelPage() {
  await requireRole(["vendor"]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-4 text-center">
      <XCircle className="h-14 w-14 text-primary" />
      <h1 className="text-2xl font-bold">Payment cancelled</h1>
      <p className="max-w-md text-muted-foreground">
        No money was charged. You can upgrade to Premium any time.
      </p>
      <Button asChild>
        <Link href="/dashboard/vendor/subscription">Back to Subscription</Link>
      </Button>
    </div>
  );
}