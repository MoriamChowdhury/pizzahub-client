"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useStats<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<T>(path)
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load data"))
      .finally(() => setLoading(false));
  }, [path]);

  return { data, error, loading };
}