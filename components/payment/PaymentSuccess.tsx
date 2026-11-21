"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [state, setState] = useState<"checking" | "active" | "delayed">("checking");

  useEffect(() => {
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    async function check() {
      try {
        const d = await apiFetch<{ plan: string }>("/api/payments/status");
        if (d.plan === "premium") {
          setState("active");
          return;
        }
      } catch {}
      tries++;
      if (tries >= 10) {
        setState("delayed");
        return;
      }
      timer = setTimeout(check, 2000);
    }
    check();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-4 text-center">
      {state === "checking" && (
        <>
          <Loader2 className="h-14 w-14 animate-spin text-primary" />
          <h1 className="text-2xl font-bold">Confirming your payment...</h1>
          <p className="text-muted-foreground">Please wait while we verify it with Stripe.</p>
        </>
      )}
      {state === "active" && (
        <>
          <CheckCircle2 className="h-14 w-14 text-green-600" />
          <h1 className="text-2xl font-bold">Payment successful!</h1>
          <p className="max-w-md text-muted-foreground">
            Your Premium plan is now active. You can publish unlimited menu items.
          </p>
        </>
      )}
      {state === "delayed" && (
        <>
          <Clock className="h-14 w-14 text-amber-500" />
          <h1 className="text-2xl font-bold">Payment is being processed</h1>
          <p className="max-w-md text-muted-foreground">
            We have not received the confirmation from Stripe yet. Premium will activate
            automatically once the payment is verified. Check the Subscription page in a minute.
          </p>
        </>
      )}
      <Button asChild>
        <Link href="/dashboard/vendor/subscription">Go to Subscription</Link>
      </Button>
    </div>
  );
}