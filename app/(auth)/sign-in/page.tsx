"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Open redirect atkate: shudhu "/" diye shuru hoy emon internal path allow
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/dashboard";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    setLoading(true);
    try {
      const { error } = await signIn.email({ email, password });
      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }
      toast.success("Welcome back!");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await signIn.social({ provider: "google", callbackURL: redirectTo });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Welcome back 🍕</CardTitle>
          <CardDescription>Sign in to your PizzaHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <p className="mt-4 text-center text-sm">
            New to PizzaHub?{" "}
            <Link
              href={
                redirectTo !== "/dashboard"
                  ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}`
                  : "/sign-up"
              }
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}