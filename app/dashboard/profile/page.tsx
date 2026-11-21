"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = {
  name: string;
  email: string;
  image?: string;
  role: string;
  businessName?: string;
  subscriptionPlan?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ user: Profile }>("/api/profile")
      .then((d) => {
        setProfile(d.user);
        setName(d.user.name);
        setBusinessName(d.user.businessName || "");
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Name is too short");

    setSaving(true);
    try {
      let image = profile?.image || "";
      if (file) {
        try {
          image = await uploadToImgBB(file);
        } catch {
          toast.error("Image upload failed. Other changes will still be saved.");
        }
      }
      const body: Record<string, string> = { name: name.trim(), image };
      if (profile?.role === "vendor") body.businessName = businessName.trim();

      const d = await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify(body) });
      toast.success(d.message);
      setFile(null);
      setProfile((p) => (p ? { ...p, name: name.trim(), image, businessName } : p));
      router.refresh(); // dashboard header e notun name/image dekhabe
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Skeleton className="mx-auto h-96 max-w-2xl rounded-xl" />;
  if (!profile) return <p className="text-center text-muted-foreground">Could not load profile.</p>;

  const preview = file ? URL.createObjectURL(file) : profile.image;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Your information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={preview || undefined} alt={profile.name} />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Label htmlFor="image">Profile Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {profile.role === "vendor" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant Name</Label>
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">Role:</span>
              <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
              {profile.role === "vendor" && (
                <>
                  <span className="text-muted-foreground">Plan:</span>
                  <Badge variant="secondary" className="capitalize">{profile.subscriptionPlan || "free"}</Badge>
                </>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}