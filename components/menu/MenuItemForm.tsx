"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, ImagePlus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { uploadToImgBB } from "@/lib/imgbb";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Initial = {
  _id?: string;
  itemName?: string;
  category?: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
};

export default function MenuItemForm({
  initial,
  onSuccess,
}: {
  initial?: Initial;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [category, setCategory] = useState(initial?.category || "");
  const [existing, setExisting] = useState<string[]>(initial?.images || []);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const total = existing.length + files.length;

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (total + picked.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setFiles((f) => [...f, ...picked]);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (!category) return toast.error("Please select a category");
    if (total === 0) return toast.error("At least one image is required");

    setLoading(true);
    try {
      const uploaded: string[] = [];
      for (const f of files) uploaded.push(await uploadToImgBB(f));

      const body = {
        itemName: String(form.get("itemName") || ""),
        category,
        description: String(form.get("description") || ""),
        price: Number(form.get("price")),
        location: String(form.get("location") || ""),
        images: [...existing, ...uploaded],
      };

      const data = await apiFetch(
        isEdit ? `/api/menu/${initial!._id}` : "/api/menu",
        { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(body) }
      );
      toast.success(data.message);
      if (onSuccess) onSuccess();
      else router.push("/dashboard/vendor/menu-items");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="itemName">Item Name</Label>
        <Input id="itemName" name="itemName" defaultValue={initial?.itemName} placeholder="Margherita Classic" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (৳)</Label>
          <Input id="price" name="price" type="number" min="1" step="any" defaultValue={initial?.price} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (area / city)</Label>
        <Input id="location" name="location" defaultValue={initial?.location} placeholder="GEC Circle, Chattogram" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={initial?.description} placeholder="Describe ingredients, size, taste..." required />
      </div>

      <div className="space-y-2">
        <Label>Item Images (up to 5, first one is the cover)</Label>
        <div className="flex flex-wrap gap-3">
          {existing.map((url) => (
            <Thumb key={url} src={url} onRemove={() => setExisting((a) => a.filter((u) => u !== url))} />
          ))}
          {files.map((f, i) => (
            <Thumb key={i} src={URL.createObjectURL(f)} onRemove={() => setFiles((a) => a.filter((_, idx) => idx !== i))} />
          ))}
          {total < 5 && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary">
              <ImagePlus className="h-5 w-5" />
              Add
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
            </label>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Saving..." : isEdit ? "Update Item" : "Add Menu Item"}
      </Button>
    </form>
  );
}

function Thumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="preview" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}