"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import MenuCard from "@/components/menu/MenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import type { MenuItem } from "@/lib/types";

const ALL = "all";

export default function MenuBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = params.get("search") || "";
  const category = params.get("category") || ALL;
  const location = params.get("location") || ALL;
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function update(changes: Record<string, string | number | null>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => {
      if (v === null || v === "" || v === ALL) next.delete(k);
      else next.set(k, String(v));
    });
    if (!("page" in changes)) next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  // Search debounce
  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  useEffect(() => {
    if (searchInput === search) return;
    const t = setTimeout(() => update({ search: searchInput.trim() }), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/locations`)
      .then((r) => r.json())
      .then((d) => setLocations(d.locations || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (category !== ALL) q.set("category", category);
    if (location !== ALL) q.set("location", location);
    q.set("sort", sort);
    q.set("page", String(page));
    q.set("limit", "9");

    setLoading(true);
    setError(false);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu?${q.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setItems(d.items);
        setPages(d.pages);
        setTotal(d.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [search, category, location, sort, page]);

  const hasFilters = search || category !== ALL || location !== ALL || sort !== "newest";

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <div className="grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, vendor, location..."
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={(v) => update({ category: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={(v) => update({ location: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Locations</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => update({ sort: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!loading && !error && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{total} item{total !== 1 && "s"} found</span>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center text-muted-foreground">
          Could not load menu items. Please try again.
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No items found</h3>
          <p className="text-sm text-muted-foreground">Try changing your search or filters.</p>
          <Button variant="outline" onClick={() => router.push(pathname)}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <MenuCard key={item._id} item={item} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>
            Previous
          </Button>
          <span className="text-sm">Page {page} of {pages}</span>
          <Button variant="outline" disabled={page >= pages} onClick={() => update({ page: page + 1 })}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}