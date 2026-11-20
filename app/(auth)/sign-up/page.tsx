"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function uploadImage(file: File): Promise<string | undefined> {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url as string;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const businessName = String(form.get("businessName") || "").trim();

    if (!name) return toast.error("Full name is required");
    if (!passwordRegex.test(password))
      return toast.error(
        "Password must be 6+ characters with one uppercase and one lowercase letter"
      );
    if (role === "vendor" && !businessName)
      return toast.error("Restaurant name is required for vendors");

    setLoading(true);
    try {
      let image: string | undefined;
      if (imageFile) {
        try {
          image = await uploadImage(imageFile);
        } catch {
          toast.error("Image upload failed. Continuing without a profile image.");
        }
      }

      const { error } = await signUp.email({
        name,
        email,
        password,
        image,
        role,
        businessName: role === "vendor" ? businessName : undefined,
      });

      if (error) {
        toast.error(error.message || "Sign up failed");
        return;
      }
      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    // Google signup e role: shobsomoy customer. Vendor hole pore profile theke
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Join PizzaHub 🍕</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              <p className="text-xs text-muted-foreground">
                Min 6 characters, one uppercase and one lowercase letter
              </p>
            </div>
            <div className="space-y-2">
              <Label>Account Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "customer" | "vendor")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor (Restaurant Owner)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "vendor" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant Name</Label>
                <Input id="businessName" name="businessName" placeholder="Tony's Pizzeria" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-red-600 hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}