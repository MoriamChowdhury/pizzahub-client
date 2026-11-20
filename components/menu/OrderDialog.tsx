"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export default function OrderDialog({
  itemId,
  itemName,
  disabled,
}: {
  itemId: string;
  itemName: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Aajker date (min date er jonno), local timezone e
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setLoading(true);
    try {
      const data = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId,
          deliveryDate: String(form.get("deliveryDate")),
          deliveryAddress: String(form.get("deliveryAddress") || ""),
          message: String(form.get("message") || ""),
        }),
      });
      toast.success(data.message);
      setOpen(false);
      router.push("/dashboard/customer/orders");
    } catch (err: any) {
      toast.error(err.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto" disabled={disabled}>
          Order Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {itemName}</DialogTitle>
          <DialogDescription>
            Fill in the delivery details. The restaurant will accept or reject your order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input id="deliveryDate" name="deliveryDate" type="date" min={today} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Textarea id="deliveryAddress" name="deliveryAddress" rows={2} placeholder="House, road, area, city" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (optional)</Label>
            <Textarea id="message" name="message" rows={2} placeholder="Special instructions..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Placing order..." : "Confirm Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}