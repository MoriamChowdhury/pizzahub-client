"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Crown } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Status = {
  plan: "free" | "premium";
  expiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  hasSubscription: boolean;
};

const freeFeatures = ["Max 3 active menu items", "Basic vendor dashboard", "Order management"];
const premiumFeatures = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement on homepage",
  "All Free features",
];

export default function SubscriptionPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      setStatus(await apiFetch<Status>("/api/payments/status"));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upgrade() {
    setPaying(true);
    try {
      const d = await apiFetch<{ url: string }>("/api/payments/checkout-session", { method: "POST" });
      if (!d.url) throw new Error("Could not start checkout");
      window.location.href = d.url;
    } catch (e: any) {
      toast.error(e.message);
      setPaying(false);
    }
  }

  async function cancelPlan() {
    setCancelling(true);
    try {
      const d = await apiFetch("/api/payments/cancel-subscription", { method: "POST" });
      toast.success(d.message);
      setConfirmCancel(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (!status) return <p className="text-center text-muted-foreground">Could not load subscription.</p>;

  const isPremium = status.plan === "premium";
  const expires = status.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Current plan: <span className="font-semibold capitalize text-foreground">{status.plan}</span>
          {isPremium && expires && (
            <> · {status.cancelAtPeriodEnd ? "Ends on" : "Renews on"} {expires}</>
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={!isPremium ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free {!isPremium && <Badge>Current</Badge>}
            </CardTitle>
            <p className="text-3xl font-extrabold">$0<span className="text-sm font-normal text-muted-foreground"> /month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={isPremium ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" /> Premium</span>
              {isPremium && <Badge>Current</Badge>}
            </CardTitle>
            <p className="text-3xl font-extrabold">$5<span className="text-sm font-normal text-muted-foreground"> /month</span></p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2 text-sm">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> {f}</li>
              ))}
            </ul>

            {!isPremium ? (
              <Button className="w-full" onClick={upgrade} disabled={paying}>
                {paying ? "Redirecting to Stripe..." : "Upgrade to Premium"}
              </Button>
            ) : status.cancelAtPeriodEnd ? (
              <p className="text-sm text-muted-foreground">
                Cancellation scheduled. You keep Premium until {expires}.
              </p>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setConfirmCancel(true)}>
                Cancel Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel Premium?"
        description={`You will keep Premium until ${expires ?? "the end of the billing period"}, then return to the Free plan.`}
        confirmText="Yes, cancel"
        destructive
        loading={cancelling}
        onConfirm={cancelPlan}
      />
    </div>
  );
}